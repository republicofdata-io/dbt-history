.DEFAULT_GOAL := help
.PHONY: help install dev build preview test lint typecheck check content-releases

help: ## Show this menu
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start the dev server at http://localhost:8081/labs/dbt-history/
	npm run dev

build: ## Production build into dist/
	npm run build

preview: ## Serve the production build locally
	npm run preview

test: ## Run the unit and content-validation tests
	npm test

lint: ## Lint the source
	npm run lint

typecheck: ## Type-check the app
	npm run typecheck

check: typecheck lint test ## Run typecheck, lint and tests

content-releases: ## Regenerate release chapter skeletons from the research inventory (skips authored chapters)
	npm run content:releases
