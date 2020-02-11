<%= app_name %> Application

Build Command:
```
cd <%= project_name %> ; mkdir -p target ; mbt build -p=cf -t=target --mtar=<%= project_name %>.mtar
```

Deploy Command:
```
cf deploy target/<%= project_name %>.mtar -f
```

Undeploy Command:
```
cf undeploy <%= app_name %> -f --delete-services
```
