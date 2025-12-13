<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ourH_O8aiY_C-gshaqACvNaVPiyo9Dtg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Development Guidelines

### Styling and Mobile Support

This application uses a centralized styling system to ensure consistent behavior across desktop and mobile devices. Before making changes to interactive elements or styling:

**📖 Read the [STYLING_GUIDE.md](STYLING_GUIDE.md)** - Essential for understanding:
- Z-index system and layer management
- Mobile touch interaction guidelines
- Button best practices
- Common pitfalls to avoid

Key principles:
- All buttons have minimum 44x44px touch targets
- Z-index values come from `constants.tsx` - never use arbitrary values
- Use active states for touch feedback
- Test on actual mobile devices, not just browser dev tools
