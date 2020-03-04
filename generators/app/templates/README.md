<%= app_name %> Application

Build Command:
```
cd <%= project_name %> ; mkdir -p mta_archives ; mbt build -p=cf -t=mta_archives --mtar=<%= project_name %>.mtar
```

Deploy Command:
```
cf deploy mta_archives/<%= project_name %>.mtar -f
```

Undeploy Command:
```
cf undeploy <%= app_name %> -f --delete-services
```
