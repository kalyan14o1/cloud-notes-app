#!/bin/bash
zip -r x23419491-cloud-notes-app.zip . -x "*.git*" "node_modules/*"
aws s3 cp x23419491-cloud-notes-app.zip s3://x23419491-source-eu-west-1/
aws codepipeline start-pipeline-execution --name x23419491-CloudNotesPipeline --region eu-west-1
