# Issaq Phone - E-commerce Store

A modern, production-ready e-commerce application built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

- Modern, responsive design with Tailwind CSS
- Full product catalog with categories and search
- Shopping cart with localStorage persistence
- Checkout flow with order creation
- Supabase backend for products and orders
- Image galleries with navigation
- Real-time inventory tracking
- Mobile-first responsive design

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Storage)
- **State Management**: React Context + Hooks
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Supabase Setup

The database schema has already been created with:
- Products table with sample data
- Categories table
- Orders table
- Row Level Security (RLS) policies

Your environment variables are already configured in `.env`.

### 3. Upload Product Images (Optional)

To use custom product images:

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a bucket named `product-images` (if not exists)
4. Set the bucket to public
5. Upload your product images
6. Update the `images` array in the products table with the public URLs

To get public URLs for uploaded images:
```
https://[your-project-ref].supabase.co/storage/v1/object/public/product-images/[filename]
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CategoryFilter.tsx
│   └── ImageGallery.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   └── Checkout.tsx
├── context/            # React Context providers
│   └── CartContext.tsx
├── lib/                # Utilities and services
│   └── supabase.ts
├── types/              # TypeScript type definitions
│   └── database.ts
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Database Schema

### Products Table
- Stores product information including title, price, images, specs
- Related to categories via foreign key
- Public read access via RLS

### Categories Table
- Product categories (Phones, Accessories, etc.)
- Public read access via RLS

### Orders Table
- Customer orders with shipping information
- Anonymous insert access for demo purposes
- Contains order items as JSONB

## Security Considerations

### Current Security Model (Demo)

This application uses Supabase's anonymous key with permissive RLS policies suitable for demonstration:

- **Products & Categories**: Public read access
- **Orders**: Anyone can create orders (no authentication required)

### Production Security Recommendations

For a production deployment, implement the following security measures:

1. **Enable Authentication**
   - Add user signup/login with Supabase Auth
   - Require authentication for checkout
   - Link orders to authenticated users

2. **Tighten RLS Policies**
   ```sql
   -- Example: Restrict order reads to order owner
   CREATE POLICY "Users can read own orders"
     ON orders FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);
   ```

3. **Use Edge Functions for Orders**
   - Create orders via Supabase Edge Function
   - Use service role key on server-side
   - Validate order data and prevent tampering
   - Process payments securely

4. **Add Payment Integration**
   - Integrate Stripe, PayPal, or similar
   - Process payments before order creation
   - Store payment references securely

5. **Environment Variables**
   - Never commit `.env` file to version control
   - Use service role key only in secure server environments
   - Rotate keys if exposed

6. **Additional Security**
   - Implement rate limiting
   - Add CAPTCHA to checkout
   - Enable audit logging
   - Add order confirmation emails
   - Implement fraud detection

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy

### Cloudflare Pages

1. Push your code to GitHub
2. Create new Pages project
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Add environment variables
6. Deploy

## Sample Products

The database includes sample products:
- iPhone 15 Pro Max
- Samsung Galaxy S24 Ultra
- Google Pixel 8 Pro
- OnePlus 12
- iPhone 14
- Various accessories (cases, chargers, cables, etc.)

## Customization

### Theme Colors

The primary brand color is teal (`#0ea5a4`). To change it:

1. Update colors in component files
2. Or add to `tailwind.config.js`:
   ```js
   theme: {
     extend: {
       colors: {
         primary: '#0ea5a4',
       }
     }
   }
   ```

### Adding Features

Common enhancements:
- User authentication and accounts
- Order history and tracking
- Product reviews and ratings
- Wishlist functionality
- Product comparison
- Advanced filtering and sorting
- Related products recommendations

## Troubleshooting

### Database Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are properly configured

### Build Errors
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (18+ required)
- Clear `node_modules` and reinstall if needed

### Image Loading Issues
- Verify image URLs are accessible
- Check Supabase Storage bucket permissions
- Ensure images are in correct format (JPEG, PNG, WebP)

## License

MIT

## Support

For issues and questions, please refer to the documentation or create an issue in the repository.
