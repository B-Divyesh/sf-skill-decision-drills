# Demo sandbox

Open `/?demo=1` or `/demo` to run the Studio handoff sample. The query entry
normalizes to the canonical `/demo` address before the three-decision player
opens. The banner says **Demo — sample data, nothing is saved** and includes
**Reset demo** plus **Start for real**.

Demo drills and attempts use the `demo:skill-decision-drills` IndexedDB
database and the `demo:sdd_initialized` localStorage key. Normal use uses
`skill-decision-drills` and `sdd_initialized`. The two namespaces never read
or write each other. Reset replaces only the demo database with the shipped
sample. Start for real clears the demo records and key before loading `/`. Both
mode changes move focus to the new page heading and announce the page name.
