## Hugo rebuild of hackerspaces.nl

The Hackerspaces.nl website has been wordpress upto this point, and
we really would like to get rid of this overly complex pile of PHP
code. This repository holds a rebuild of the website using Hugo to
create a static version of the website.

During the php2shell vulneratility we switched over to the hugo
version of hackerspaces.nl, so we could finally get more incentive
to complete this version.

### Currently implemented

- Most of the 'fixed' pages
- The Map of the hackerspaces
- Client-side search (/search)

### Still missing

- Fixing layout/design/styling, using the 'terminal' theme.
- Mediatheek page links, and fixing dead links there
- Automated deployment workflow (partial)
- Method to publish / preview drafts (dev.hackerspaces.nl will pull
  from the 'dev' branch in git. The main branch will be served on
  the base hackerspaces.nl url)
- The dev branch is built with draft-pages enabled, the production
  version without.
- Rendering of rss-feeds (feeds are combined on the server into a
  single feeds.xml file from a cronjob)

## Helping

If you can help, you are more then welcome to join us. All the code
is in this repository. Some issues have been created to keep track
of todo-items.

The webserver automatically pulls the dev version every 5 minutes
and the production version about every 12. The spacestate content
for the 'map' page is shared between dev and prod, and updated
every 4 minutes from a seperate update-script.
