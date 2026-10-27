#!/bin/bash

git stash
case "$(pwd -P)" in
    /srv/hackerspaces.nl/static-website)
        ENVIRONMENT=production
        HUGOOPTS=""
        ;;
    /srv/hackerspaces.nl/dev-source)
        ENVIRONMENT=development
        HUGOOPTS="--buildDrafts"
        ;;
    *)
        echo "Error: unknown website directory: $(pwd -P)" >&2
        exit 1
        ;;
esac

git pull && exec .venv/bin/hugo --environment "$ENVIRONMENT" --gc --minify "$HUGOOPTS"

