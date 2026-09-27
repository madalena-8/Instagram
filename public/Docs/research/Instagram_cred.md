# Ticket #2 — Instagram Developer Credentials

**Owner:** Mbuyiselo  
**Branch:** `feature/meta-authentication`  
**Status:** Completed

## Goal

Configure the Instagram/Meta authentication required for the backend to communicate with the Instagram API.

## What Was Done

### 1. Instagram Test Account

A dedicated Instagram test account was created and converted to a Professional Business account.

This account is used for development and API testing.

### 2. Meta Developer App

A Meta Developer application was created:

`social_feed_api`

The project uses:

**Instagram API with Instagram Login**

This means the backend communicates with Instagram through the Instagram API rather than requiring the client website to communicate with Instagram directly.

### 3. Instagram Tester

The development Instagram account was added to the Meta application as an:

`Instagram Tester`

The tester invitation was accepted through the Instagram account.

### 4. Access Token

An Instagram access token was generated for the authorised test account.

The token is stored only in the local `.env` file.

The token must never be committed to GitHub.

### 5. Instagram Account ID

The numeric Instagram Account ID was retrieved from the Meta Developer dashboard and stored locally.

The backend configuration uses:

```env
INSTAGRAM_ACCESS_TOKEN=<private>
INSTAGRAM_ACCOUNT_ID=<private>