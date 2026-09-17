.PHONY: up down logs ps test clean

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f api

ps:
	docker compose ps

test:
	curl http://localhost:3000/api/health
	curl http://localhost:3000/api/usuarios

clean:
	docker compose down -v