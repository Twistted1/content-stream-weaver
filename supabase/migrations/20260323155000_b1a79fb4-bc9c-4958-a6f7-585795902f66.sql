
SELECT cron.schedule(
  'run-scheduled-pipelines',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://jvbucspwcjahqpoxskvr.supabase.co/functions/v1/scheduled-pipeline',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2YnVjc3B3Y2phaHFwb3hza3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM5MjksImV4cCI6MjA4NDUxOTkyOX0.X5pA6-DsflBoLEtwSj3N1oISjg_qYCKt2OajMNx6PSU"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
