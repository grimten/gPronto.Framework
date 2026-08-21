We are to create a new issue. It will have multiple steps.

1. On all layouts, we will add one gComponent called PrototypeInfo as a fixed component.

That component will do several things.

1.1. First, we will add a new variable to the environment file that will hold a prototype ID. All applications will have that variable, including Backstage.
1.2. When we start the application, the prototype ID is sent to the framework, and we will add the information to the application, just as we do with the user and organisation.
We will add tables to each prototyupe that will hold ceratin information that we will store.


1. It is active only on a prototype, not on Backstage. Backstage can use the layout, but the component is not active there.

2. On each prototype, that component will get information about the webpage prototype, the prototype user (mock user), the logged-in Backstage user, and, later, more information.

3. When that is done, we will create a test. The test will verify that this component is visible as an extra footer showing that information.

4. When the test passes, we will move on.

5. Now we want to show information about each page in a panel and add other features. We want to:
   - have a panel on the right side of the screen that can be hidden or shown and displays information about the current webpage. We will pull that information from a database in Backstage or, if needed, from the prototype and create a new table where we can sync some data;
   - have a help menu on the right; details will be added later.

## Decisions

1. The final public **gComponent** name is `GComponentPrototypeInfo`.
2. Every current **gPronto.Application** environment file contains its own UUID in `GPRONTO_PROTOTYPE_ID`, including **gPronto.Application.Backstage**.
3. Every current **gPronto.Application** environment file contains `GPRONTO_APPLICATION_TYPE`, whose value is exactly `PROTOTYPE` or `BACKSTAGE`.
4. The existing Vite `envPrefix` value `["VITE_", "GPRONTO_"]` exposes both environment values. Browser source reads the UUID from `import.meta.env.GPRONTO_PROTOTYPE_ID`, and no Vite configuration change is required.
5. Every **gPronto.Application** passes both environment values to **gPronto.Framework** during bootstrap. A missing value, an invalid UUID, or an application type other than `PROTOTYPE` or `BACKSTAGE` causes bootstrap to throw and the application to stop.
6. The application-root public interface gains a new immutable `Prototype` object containing exactly `PrototypeId` and `ApplicationType`. These values are not added to the Authentication-owned **User**, **Organisation**, or **Session** objects.
7. `GComponentPrototypeInfo` is a **Fixed slot** at the bottom of every public **gLayout**.
8. `GComponentPrototypeInfo` renders only when `Prototype.ApplicationType` is `PROTOTYPE`. It renders nothing when the value is `BACKSTAGE` or while required information is loading, absent, or unavailable.
9. A blank footer placeholder is not implemented or tested. The visible footer and its automated test require a resolved visible-content contract.
10. The first automated test covers every public **gLayout**, every current **gPronto.Application.Prototype**, and the absence of visible component output in **gPronto.Application.Backstage**.
11. Database table definitions and synchronization implementation remain outside this issue and are specified in `gPronto.Framework:issues/issue-new-tables-sync.md`.
12. The right-side information panel and help menu are later work and are not completion criteria for this issue.

<user-comment> 


1, yes
2, expand, dont get it
3, each .env file will have the value PROTOTYPE_ID (a guuid)
4, each .env file will have a value GPRONTO_APPLICATION_TYPE = PROTOTYPE or BACKSTAGE, and if backstage, we dont display the component, but we load info from the database
5, we crash
6, a new object, call that prototype
7, at the bottom (that will be changed later, so not important)
8, keep open for now
9, frtom a table, keep thjis open for now
10, keep open for now
11 just blank
12 yes
13 that is for later

</user-comment>
<agent-comment>
2026-08-21 10:13 **Mr Ricky**

Remaining questions

1. Should the UUID variable be renamed to `GPRONTO_PROTOTYPE_ID`, which works with the current Vite configuration, or should every application's Vite `envPrefix` configuration be changed so the exact name `PROTOTYPE_ID` is exposed?
2. What UUID does **gPronto.Application.Backstage** receive in its identifier variable? Is it the existing Backstage application ID even though the public object and property are prototype-named?
3. Is the public property name exactly `Prototype` with an uppercase `P`? Which fields must it contain initially: `PrototypeId` and `ApplicationType`, or another shape?
4. Because the displayed fields and database source remain open, should the first implementation and test verify only the footer container and its prototype-only visibility, with its content temporarily blank?

</agent-comment>

<user-comment> 
1, see env files
2, see env file
3, that is enough for now
4, wait for the db


</user-comment>
<agent-comment status="waiting-for-user">
2026-08-21 11:45 **Mrs Senior Specs**

The database contract in `gPronto.Framework:issues/issue-new-tables-sync.md` is ready. It makes **gPronto.Application.Backstage** authoritative for synchronized `project_prototypes` and `project_prototypes_webpages` data, and it gives each **gPronto.Application.Prototype** its own prototype row plus webpage rows containing `path`, `name`, and `description`. It does not define transfer of the signed-in Backstage **User** or **Mock user** fields. The first visible `GComponentPrototypeInfo` therefore needs an exact content boundary before its interface, loading behavior, and automated test can be specified.

The metadata-only answer would display the synchronized prototype name and the current webpage name and description; it can be implemented after the database issue and leaves identity transfer for later work. Waiting for the Backstage **User** and **Mock user** contracts would keep the footer blocked but allow all intended identities to arrive together. Defining those identity-transfer contracts here would expand this issue into Authentication and cross-database data-boundary work.

The recommended answer is the metadata-only first version because it uses the now-defined database rows, satisfies the earlier decision to wait for the database contract, and keeps the still-undefined identity transfer outside this issue.

Should the first visible `GComponentPrototypeInfo` display only the synchronized prototype name and current webpage name and description, with Backstage **User** and **Mock user** information deferred to a later contract?
</agent-comment>
