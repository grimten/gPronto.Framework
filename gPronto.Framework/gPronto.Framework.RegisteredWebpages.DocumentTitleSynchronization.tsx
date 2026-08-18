import { useEffect } from "react";
import { useLocation } from "react-router";
import { getGProntoFrameworkApplicationRootPublicPropertiesSnapshot } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import type { GProntoFrameworkRegisteredWebpageDefinition } from "./gPronto.Framework.RegisteredWebpages.DefinitionContract";
import { recordGProntoFrameworkUserEvent } from "./gPronto.Framework.UserEvents.Runtime";

type GRegisteredWebpageDocumentTitleSynchronizationProps = {
  webpage: GProntoFrameworkRegisteredWebpageDefinition;
};

export function GRegisteredWebpageDocumentTitleSynchronization({
  webpage,
}: GRegisteredWebpageDocumentTitleSynchronizationProps) {
  const WebpageComponent = webpage.component;
  const location = useLocation();

  useEffect(() => {
    document.title = webpage.metadata.title;
  }, [webpage.metadata.title]);

  useEffect(() => {
    const publicProperties =
      getGProntoFrameworkApplicationRootPublicPropertiesSnapshot();

    recordGProntoFrameworkUserEvent({
      event_type: "page_visit",
      key: location.key,
      page_id: webpage.id,
      route: location.pathname,
      session_id: publicProperties.Session.SessionId,
      actor_user_id: publicProperties.User.UserId,
    });
  }, [location.key, location.pathname, webpage.id]);

  return <WebpageComponent />;
}
