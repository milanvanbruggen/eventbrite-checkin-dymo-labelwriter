
# Eventbrite Check-in > DYMO LabelWrite

This app receives data and sends a print command to the DYMO LabelWriter.

## Make app public
We want the application to be addressable from the outside. For instance: you could use Make or Zapier to make a HTTP call to the app when an event takes place (check-in in this case).

Set-up a ngrok account and configure your domain: https://dashboard.ngrok.com/get-started/setup.
```
ngrok http --domain=[your-domain].app 80
```

We use ngrok to make the app public.

## Start Node.js app
```
node server.mjs


## Check Eventbrite event and call app
You need to do this first, before being able to use this application.
Create a Make.com account. Go to 'Scenarios' and create a new Scenario

### 1. Add module: Webhooks (Custom webhook)
Add a custom webhook. The URL of the webbook is to be used in the Eventbrite webhook.

### 2. Create Eventbrite Webhook
Go to Eventbrite Webhooks (https://www.eventbrite.nl/account-settings/webhooks) and create a webhook with the URL from the custom webhook - you got from the Make Custom Webhook.

Choose "attendee.checked_in" from the actions to trigger the webhook when a visitor is checked in.

### 3. Add module: Text Parser (Replace)
Before parsing the URL to the "Eventbrite Make an API Call" module in our Make Scenario, we need to filter out the first part of the URL.

Add the "Text Parser" module and use the "Replace" option. Configure the module like this:
```
- Pattern: ^https:\/\/www\.eventbriteapi\.com\/
- New value: /
- Global match: Yes
- Case sensitive: No
- Multiline: No
- Singleline: No
- Text: [api_url] (variable received from webhook in first step) 
```

### 4. Add module: Eventbrite (Make an API Call)
Add this module as the next step in the Make Scenario and connect to the Eventbrite-account you added the webhook to.

Configure the module like this:
```
- URL: [Text] (variable received from Text Parser from the previous step) 
- Method: GET
```

### 5. Add module: HTTP (Make a request)
We have now got the info from Eventbrite about the attendee that has been checked in. We now want to send (some of) that info to our application, so we can print a label.

Configure the module like this:
```
- URL: [your-ngrok-url]/webhook/
- Method: POST
- Query String
    - Item 1
        - Name: fname
        - Value: [body.profile.first_name] (variable from Eventbrite API Call response)
    - Item 2
        - Name: lname
        - Value: [body.profile.last_name] (variable from Eventbrite API Call response)
    - Item 3
        - Name: company
        - Value: [body.profile.company] (variable from Eventbrite API Call response)
- Parse response: No
```

### General settings
Set Scheduling to 'On'.
