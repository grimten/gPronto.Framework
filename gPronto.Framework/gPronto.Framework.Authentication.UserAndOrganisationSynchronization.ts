import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  replaceGProntoFrameworkApplicationRootPublicPropertiesState,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import {
  createGProntoFrameworkApplicationRootDefaultOrganisation,
  createGProntoFrameworkApplicationRootDefaultSession,
  createGProntoFrameworkApplicationRootDefaultUser,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesDefaults";

const hydrationFunctionName =
  "get_gpronto_framework_application_root_properties_version_1";

type HydrationRequest = {
  readonly generation: number;
  readonly userId: string;
};

type HydratedUser = {
  readonly id: string;
  readonly authUserId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: "standard" | "admin";
  readonly roleApplication: string | null;
  readonly rolePrototype: string | null;
  readonly organisationId: string | null;
};

type HydratedOrganisation = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
};

type HydratedSession = {
  readonly sessionId: string;
};

type HydrationResponse = {
  readonly user: HydratedUser;
  readonly organisation: HydratedOrganisation | null;
  readonly session: HydratedSession;
};

export type GProntoFrameworkAuthenticationUserAndOrganisationSynchronization = {
  clear(): boolean;
  synchronizeInitialSession(session: Session): boolean;
  synchronizeSignedIn(session: Session): boolean;
  synchronizePasswordRecovery(session: Session): boolean;
  synchronizeTokenRefreshed(session: Session): boolean;
  synchronizeUserUpdated(session: Session): boolean;
  synchronizeMfaChallengeVerified(session: Session): boolean;
  stop(): void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(
      value,
    )
  );
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function validateHydrationResponse(value: unknown): HydrationResponse | null {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !isRecord(value.user) ||
    !isRecord(value.session)
  ) {
    return null;
  }

  const user = value.user;
  const session = value.session;

  if (
    !isUuid(user.id) ||
    !isUuid(user.auth_user_id) ||
    typeof user.first_name !== "string" ||
    typeof user.last_name !== "string" ||
    (user.role !== "standard" && user.role !== "admin") ||
    !isNullableString(user.role_application) ||
    !isNullableString(user.role_prototype) ||
    !(user.organisation_id === null || isUuid(user.organisation_id)) ||
    !isUuid(session.session_id)
  ) {
    return null;
  }

  let organisation: HydratedOrganisation | null = null;

  if (value.organisation !== null) {
    if (
      !isRecord(value.organisation) ||
      !isUuid(value.organisation.id) ||
      typeof value.organisation.name !== "string" ||
      typeof value.organisation.organisation_type !== "string"
    ) {
      return null;
    }

    organisation = {
      id: value.organisation.id,
      name: value.organisation.name,
      type: value.organisation.organisation_type,
    };
  }

  if (
    (user.organisation_id === null && organisation !== null) ||
    (organisation !== null && organisation.id !== user.organisation_id)
  ) {
    return null;
  }

  return {
    user: {
      id: user.id,
      authUserId: user.auth_user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      roleApplication: user.role_application,
      rolePrototype: user.role_prototype,
      organisationId: user.organisation_id,
    },
    organisation,
    session: {
      sessionId: session.session_id,
    },
  };
}

function replaceWithSessionIdentityDefaults(session: Session): void {
  const User = createGProntoFrameworkApplicationRootDefaultUser();
  const Organisation =
    createGProntoFrameworkApplicationRootDefaultOrganisation();
  const Session = createGProntoFrameworkApplicationRootDefaultSession();

  User.AuthUserId = session.user.id;
  User.Email = session.user.email ?? "-";

  replaceGProntoFrameworkApplicationRootPublicPropertiesState(
    User,
    Organisation,
    Session,
  );
}

function updateSessionIdentityWhilePreservingState(session: Session): void {
  const currentState =
    getGProntoFrameworkApplicationRootPublicPropertiesSnapshot();
  const Email = session.user.email ?? "-";

  if (
    currentState.User.AuthUserId === session.user.id &&
    currentState.User.Email === Email
  ) {
    return;
  }

  replaceGProntoFrameworkApplicationRootPublicPropertiesState(
    {
      ...currentState.User,
      AuthUserId: session.user.id,
      Email,
    },
    { ...currentState.Organisation },
    { ...currentState.Session },
  );
}

function replaceWithHydrationResponse(
  response: HydrationResponse,
  session: Session,
): void {
  const User = createGProntoFrameworkApplicationRootDefaultUser();
  const Organisation =
    createGProntoFrameworkApplicationRootDefaultOrganisation();
  const Session = {
    ...createGProntoFrameworkApplicationRootDefaultSession(),
    SessionId: response.session.sessionId,
  };

  User.UserId = response.user.id;
  User.AuthUserId = session.user.id;
  User.Email = session.user.email ?? "-";
  User.FirstName = response.user.firstName;
  User.LastName = response.user.lastName;
  User.Role = response.user.role;
  User.RoleApplication = response.user.roleApplication ?? User.RoleApplication;
  User.RolePrototype = response.user.rolePrototype ?? User.RolePrototype;
  User.OrganisationId = response.user.organisationId ?? User.OrganisationId;

  if (response.organisation !== null) {
    Organisation.OrganisationId = response.organisation.id;
    Organisation.Name = response.organisation.name;
    Organisation.Type = response.organisation.type;
  }

  replaceGProntoFrameworkApplicationRootPublicPropertiesState(
    User,
    Organisation,
    Session,
  );
}

export function createGProntoFrameworkAuthenticationUserAndOrganisationSynchronization(
  client: SupabaseClient,
  onStateCommitFailure: (error: unknown) => void,
): GProntoFrameworkAuthenticationUserAndOrganisationSynchronization {
  let active = true;
  let latestSession: Session | null = null;
  let activeUserId: string | undefined;
  let requestGeneration = 0;
  let scheduledOrRunningRequest: HydrationRequest | undefined;
  let lastSuccessfullyHydratedUserId: string | undefined;
  let failedHydrationUserId: string | undefined;
  let automaticRetryAvailable = false;

  function invalidatePendingHydration(): void {
    requestGeneration += 1;
    scheduledOrRunningRequest = undefined;
  }

  function ownsRequest(request: HydrationRequest): boolean {
    return (
      active &&
      requestGeneration === request.generation &&
      scheduledOrRunningRequest?.generation === request.generation &&
      scheduledOrRunningRequest.userId === request.userId &&
      latestSession?.user.id === request.userId
    );
  }

  function clearRequestIfOwned(request: HydrationRequest): void {
    if (
      scheduledOrRunningRequest?.generation === request.generation &&
      scheduledOrRunningRequest.userId === request.userId
    ) {
      scheduledOrRunningRequest = undefined;
    }
  }

  function commitHydrationFailure(request: HydrationRequest): void {
    if (!ownsRequest(request) || latestSession === null) {
      return;
    }

    lastSuccessfullyHydratedUserId = undefined;
    failedHydrationUserId = request.userId;

    try {
      replaceWithSessionIdentityDefaults(latestSession);
    } catch (error) {
      onStateCommitFailure(error);
    }
  }

  async function hydrate(request: HydrationRequest): Promise<void> {
    if (!ownsRequest(request)) {
      clearRequestIfOwned(request);
      return;
    }

    try {
      let rpcResult: Awaited<ReturnType<SupabaseClient["rpc"]>>;

      try {
        rpcResult = await client.rpc(hydrationFunctionName);
      } catch {
        commitHydrationFailure(request);
        return;
      }

      if (!ownsRequest(request) || latestSession === null) {
        return;
      }

      const response =
        rpcResult.error === null
          ? validateHydrationResponse(rpcResult.data)
          : null;

      if (
        response === null ||
        response.user.authUserId !== latestSession.user.id
      ) {
        commitHydrationFailure(request);
        return;
      }

      try {
        replaceWithHydrationResponse(response, latestSession);
      } catch (error) {
        lastSuccessfullyHydratedUserId = undefined;
        failedHydrationUserId = undefined;
        onStateCommitFailure(error);
        return;
      }

      lastSuccessfullyHydratedUserId = request.userId;
      failedHydrationUserId = undefined;
    } finally {
      clearRequestIfOwned(request);
    }
  }

  function reserveHydration(session: Session, force: boolean): void {
    if (!active) {
      return;
    }

    if (force) {
      invalidatePendingHydration();
      lastSuccessfullyHydratedUserId = undefined;
      failedHydrationUserId = undefined;
    } else if (scheduledOrRunningRequest !== undefined) {
      return;
    }

    requestGeneration += 1;

    const request: HydrationRequest = {
      generation: requestGeneration,
      userId: session.user.id,
    };

    scheduledOrRunningRequest = request;

    setTimeout(() => {
      void hydrate(request);
    }, 0);
  }

  function startAuthenticationEpisode(
    session: Session,
    preserveMatchingState: boolean,
  ): void {
    invalidatePendingHydration();
    latestSession = session;
    activeUserId = session.user.id;
    lastSuccessfullyHydratedUserId = undefined;
    failedHydrationUserId = undefined;
    automaticRetryAvailable = true;

    const currentState =
      getGProntoFrameworkApplicationRootPublicPropertiesSnapshot();

    if (
      preserveMatchingState &&
      currentState.User.AuthUserId === session.user.id
    ) {
      updateSessionIdentityWhilePreservingState(session);
    } else {
      replaceWithSessionIdentityDefaults(session);
    }
  }

  function synchronizeIdentityOnly(session: Session): boolean {
    if (!active) {
      return false;
    }

    if (activeUserId !== session.user.id) {
      return false;
    }

    latestSession = session;
    updateSessionIdentityWhilePreservingState(session);
    return true;
  }

  return {
    clear(): boolean {
      if (!active) {
        return false;
      }

      invalidatePendingHydration();
      latestSession = null;
      activeUserId = undefined;
      lastSuccessfullyHydratedUserId = undefined;
      failedHydrationUserId = undefined;
      automaticRetryAvailable = false;

      replaceGProntoFrameworkApplicationRootPublicPropertiesState(
        createGProntoFrameworkApplicationRootDefaultUser(),
        createGProntoFrameworkApplicationRootDefaultOrganisation(),
        createGProntoFrameworkApplicationRootDefaultSession(),
      );

      return true;
    },

    synchronizeInitialSession(session: Session): boolean {
      if (!active) {
        return false;
      }

      startAuthenticationEpisode(session, true);
      reserveHydration(session, true);
      return true;
    },

    synchronizeSignedIn(session: Session): boolean {
      if (!active) {
        return false;
      }

      if (activeUserId !== session.user.id) {
        startAuthenticationEpisode(session, false);
        reserveHydration(session, false);
        return true;
      }

      latestSession = session;
      updateSessionIdentityWhilePreservingState(session);

      if (
        scheduledOrRunningRequest !== undefined ||
        lastSuccessfullyHydratedUserId === session.user.id
      ) {
        return true;
      }

      if (
        failedHydrationUserId === session.user.id &&
        automaticRetryAvailable
      ) {
        automaticRetryAvailable = false;
        reserveHydration(session, false);
      }

      return true;
    },

    synchronizePasswordRecovery(session: Session): boolean {
      if (!active) {
        return false;
      }

      if (activeUserId !== session.user.id) {
        startAuthenticationEpisode(session, false);
      } else {
        latestSession = session;
        updateSessionIdentityWhilePreservingState(session);
      }

      reserveHydration(session, true);
      return true;
    },

    synchronizeTokenRefreshed: synchronizeIdentityOnly,
    synchronizeUserUpdated: synchronizeIdentityOnly,

    synchronizeMfaChallengeVerified(session: Session): boolean {
      if (!active) {
        return false;
      }

      if (activeUserId !== session.user.id) {
        startAuthenticationEpisode(session, false);
        reserveHydration(session, false);
        return true;
      }

      latestSession = session;
      updateSessionIdentityWhilePreservingState(session);
      return true;
    },

    stop(): void {
      if (!active) {
        return;
      }

      active = false;
      invalidatePendingHydration();
      latestSession = null;
      activeUserId = undefined;
      lastSuccessfullyHydratedUserId = undefined;
      failedHydrationUserId = undefined;
      automaticRetryAvailable = false;
    },
  };
}
