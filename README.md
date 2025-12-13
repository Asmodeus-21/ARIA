<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ARIA - AI Receptionist Application

This is a comprehensive AI receptionist platform with real-time voice capabilities, chat integration, and lead management.

## Features

- 🎙️ Real-time voice assistant with OpenAI Whisper transcription
- 💬 Streaming AI chat powered by OpenAI GPT-4
- 🔊 Optional text-to-speech with ElevenLabs
- 💳 Stripe checkout integration for subscriptions
- 📋 Lead capture and management with GoHighLevel integration
- 📱 Mobile-optimized UI with proper touch handling

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with the following required variables:
   ```
   # Required for AI features
   OPENAI_API_KEY=your_openai_api_key_here

   # Required for payments
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   SITE_URL=http://localhost:3000

   # Required for lead management
   GHL_API_KEY=your_ghl_api_key_here
   GHL_LOCATION_ID=your_ghl_location_id_here
   GHL_ENDPOINT=https://services.leadconnectorhq.com
   GHL_DEFAULT_TAG=Website Lead

   # Optional for text-to-speech
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run type checking:
   ```bash
   npm run typecheck
   ```

## Environment Variables

### Required

- **OPENAI_API_KEY**: OpenAI API key for chat completions and Whisper transcription
- **STRIPE_SECRET_KEY**: Stripe secret key for payment processing
- **GHL_API_KEY**: GoHighLevel API key for lead management
- **GHL_LOCATION_ID**: GoHighLevel location ID

### Optional

- **ELEVENLABS_API_KEY**: ElevenLabs API key for text-to-speech
- **ELEVENLABS_VOICE_ID**: ElevenLabs voice ID for TTS
- **SITE_URL**: Base URL for your site (default: https://ariagroups.xyz)
- **GHL_ENDPOINT**: GoHighLevel API endpoint (default: https://services.leadconnectorhq.com)
- **GHL_DEFAULT_TAG**: Default tag for leads (default: Website Lead)

## API Endpoints

- **POST /api/ai-chat**: Streaming chat with OpenAI GPT-4
- **POST /api/aria-realtime**: Voice transcription with Whisper + optional TTS
- **POST /api/create-checkout-session**: Create Stripe checkout session
- **POST /api/ghl-lead**: Submit lead to GoHighLevel

## Testing

### Manual Testing Steps

1. **Chat Modal**: 
   - Open chat and send a message
   - Verify streaming response works
   - Check mobile touch interactions

2. **Voice Assistant**:
   - Click microphone to record
   - Verify transcription appears
   - Check audio playback (if ElevenLabs configured)

3. **Pricing Buttons**:
   - Test on mobile device
   - Verify buttons respond to taps
   - Check Stripe checkout flow

4. **Lead Capture**:
   - Submit lead form
   - Verify data sent to GoHighLevel
   - Check error handling

5. **Floating Chat**:
   - Verify doesn't block taps on underlying content
   - Check keyboard navigation works
   - Test expand/collapse on mobile

## Deployment

This app is designed to deploy on Vercel with serverless API routes.

1. Push to GitHub
2. Connect to Vercel
3. Add all required environment variables
4. Deploy

## License

Proprietary - All rights reserved
