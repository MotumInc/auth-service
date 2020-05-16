[![DeepScan grade](https://deepscan.io/api/teams/8152/projects/11538/branches/172733/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8152&pid=11538&bid=172733)
# auth-service
Authentication micro-service for the "Intro to the cloud technologies" course

Steps to get it up and running:
- Specify environment variables, such as:
  - `ACCESS_TOKEN_SECRET`: secret key wich will be used to sign accesss tokens
  - `REFRESH_TOKEN_SECRET`: secret key wich will be used to sign accesss tokens
  - `USER_REGISTRY_URL`: url on which `user-registry-service` is available
  - `DATABASE_URL`: posrgress URL to a database in format: `postgresql://<username>:<password>@<hostname>:<port>/<database>?schema=<schema_name>` (for e.g. `postgresql://user:password@localhost:5432/motum?schema=public`)
  - `PORT`: port on which REST authentication api will be available
  - `SERVICE_PORT`: port on which gRPC authentication api will be available
  - `BIND_ADDRESS`: address to bind REST api socket to
