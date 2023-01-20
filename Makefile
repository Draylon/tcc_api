ifneq (,$(wildcard ./.env))
    include .env
    export
endif

cmd-exists-%:
	@hash $(*) > /dev/null 2>&1 || \
		(echo "ERROR: '$(*)' must be installed and available on your PATH."; exit 1)

env_check: cmd-exists-psql
	echo "${NODE_ENV}"

gitpush:
	git push origin ${NODE_ENV}

git_production:
	git checkout ${NODE_ENV}
	git merge master
	git checkout master
	git merge --no-ff development
	