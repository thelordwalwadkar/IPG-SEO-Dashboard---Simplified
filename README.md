# IPG SEO Dashboard - Simplified

A plain-language monthly report for non-SEO readers: Month at a glance, Rankings, Discoverability, Traffic, Work done.
`index.html` is a sign-in page holding the report in encrypted form (AES-256-GCM). The readable report and data stay on the local machine.
Engagement and enquiry numbers on the Traffic tab are example figures, clearly labelled, until GA4 is connected.

Rebuild: `node build-simple-data.js "../IPG Dashboard/data.json" data-simple.json`, `node assemble-simple.js data-simple.json "IPG SEO Dashboard - Simplified.html"`,
then `DASH_ID=... DASH_PW=... node encrypt.js "IPG SEO Dashboard - Simplified.html" index.html`.
