# Product Requirements Document (PRD)

## Product: PhysioVerse Booking Platform

### Overview
PhysioVerse is a platform for booking physiotherapy and gym spaces. Users can search, filter, and book spaces based on a variety of criteria.

---

## 1. Core Features

### 1.1 Space Search & Filtering
- Users can search for spaces by city (Canadian cities only).
- Users can refine their search using filters:
  - **Space Type** (manual, rehab, acupuncture, strength, etc.)
  - **Room Type** (private, shared, either)
  - **Amenities** (hydraulic table, available linen, on-site laundry, sharps disposal, gym space, squat rack, barbell, dumbbells, weight plates, pull-up bar, bench, reception area)
  - **Reception Area** (yes/no)
  - **Linen Service** (yes/no)
  - **Price Range** (min/max per hour)
  - **Category** (as above, via filter bar)
- Only spaces matching all selected filters are shown in results.
- **Filters are accumulated in a multi-step dialog and only applied when the user clicks "Show Results."**
- **The URL is updated with all selected filters as query parameters.**
- **The main page reads filters from the URL and fetches only matching spaces.**
- **The filter bar (MapFilterItems) updates the URL and results when a category is selected.**
- **If no spaces match the filters, a friendly "No results found" message is shown.**

### 1.2 Space Details & Booking (Dialog)
- When a user clicks a space, a dialog/modal opens (not a new page).
- The dialog displays:
  - Space title, city, price, availability
  - List of amenities/categories
  - Images
  - Host info
  - **Booking form** with calendar (using the `SelectCalender` component)
- Users can select dates/times and book the space directly from the dialog.
- The dialog can be closed to return to the search results.

### 1.3 Booking
- Users can book available spaces for specific times.
- Booking form validates against existing bookings.

---

## 2. Filtering System Requirements

- Filters are accumulated in a multi-step dialog (city, then refine search).
- Filters are only applied when the user completes the dialog and clicks "Show Results".
- The URL is updated with all selected filters as query parameters.
- The main page reads filters from the URL and fetches only matching spaces.
- The filter bar (MapFilterItems) updates the URL and results when a category is selected.
- **Backend filtering logic combines all filters (city, category, etc.) instead of overwriting queries.**
- **Category filtering is based on the `space_categories` join table and `categories` table, not on the description or other fields.**
- **The frontend maps equipment selection to the `category` filter in the URL, so the backend can filter by category.**
- Backend must join `spaces`, `space_categories`, and `categories` to filter by category.
- If no spaces match the filters, show a friendly "No results found" message.

---

## 3. Admin/Host Features
- Hosts can list new spaces, set amenities, upload images, and set prices.
- Hosts can see their own listings and bookings.

---

## 4. User Experience
- Responsive design for desktop and mobile.
- Fast, clear feedback when filters are applied.
- Easy to reset or clear filters.
- **Space details and booking are shown in a dialog/modal, not a new page.**
- **The search dialog closes automatically when "Show Results" is clicked.**
- **The container width and layout are customizable via Tailwind CSS.**

---

## 5. Technical Notes
- Uses Supabase for backend and storage.
- Uses Next.js (App Router) for frontend.
- Uses Mapbox for maps.
- All filtering logic must be robust and match the PRD above.
- **SelectCalender component is used in the space details dialog for booking date selection.**

---

## 6. Out of Scope
- Payment processing (for now)
- International cities (Canada only for MVP)

---

## 7. Open Questions
- Should users be able to save favorite searches?
- Should hosts be able to set custom cancellation policies?

---

*This PRD is a living document and should be updated as requirements evolve.* 