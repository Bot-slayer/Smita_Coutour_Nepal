# E-commerce Features Implementation Plan

This plan covers the implementation of the Shopping Cart, User Account System, Checkout, and Order History for the Smita Couture Nepal project.

## User Review Required

> [!IMPORTANT]
> - The authentication system is currently using a mock service (`authService.ts`). Firebase integration is planned for later but the architecture is prepared.
> - Payment is currently limited to "Cash on Delivery" and "Bank Transfer" for the MVP.
> - Order data is persisted in `localStorage`.

## Proposed Changes

### 1. Shopping Cart & Checkout Refinement

#### [MODIFY] [CheckoutPage.tsx](file:///C:/Users/12rub/Desktop/Smita Couture Nepal/src/pages/CheckoutPage.tsx)
- Add "Area" field to the delivery address form.
- Ensure all required customer information is collected.
- Refine the order object creation to match Requirement 17.

#### [MODIFY] [orderService.ts](file:///C:/Users/12rub/Desktop/Smita Couture Nepal/src/services/orderService.ts)
- Update `createOrder` to use `orderId` and other fields correctly as per the `Order` type.

### 2. User Account System

#### [NEW] [DashboardPage.tsx](file:///C:/Users/12rub/Desktop/Smita Couture Nepal/src/pages/account/DashboardPage.tsx)
- Main landing page for `/account`.
- Links to Profile, Orders, Wishlist, Addresses, and Logout.

#### [NEW] [OrderHistoryPage.tsx](file:///C:/Users/12rub/Desktop/Smita Couture Nepal/src/pages/account/OrderHistoryPage.tsx)
- List of previous orders.
- Shows Order number, Date, Total, Status, and "View Details" button.

#### [NEW] [OrderDetailsPage.tsx](file:///C:/Users/12rub/Desktop/Smita Couture Nepal/src/pages/account/OrderDetailsPage.tsx)
- Detailed view of a specific order.

#### [MODIFY] [App.tsx](file:///C:/Users/12rub/Desktop/Smita Couture Nepal/src/App.tsx)
- Add routes for `/account`, `/account/orders`, and `/account/orders/:id`.

### 3. Order Success Page Refinement

#### [MODIFY] [OrderSuccessPage.tsx](file:///C:/Users/12rub/Desktop/Smita Couture Nepal/src/pages/OrderSuccessPage.tsx)
- Ensure it displays the order number, items, total, and status clearly.

## Verification Plan

### Manual Verification
- Add items to cart and verify persistence.
- Complete checkout with a mock order.
- Verify order appears in "My Orders" history.
- Check order details page for accuracy.
- Test registration and login flow.
