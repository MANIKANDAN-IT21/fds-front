import { Routes } from '@angular/router';
import { DeliveryloginComponent } from './DeliverySide/deliverylogin/deliverylogin.component';
import { AuthGuard } from './auth.guard';
import { DeliveryComponent } from './DeliverySide/delivery/delivery.component';
import { HomeComponent } from './AdminSide/home/home.component';
import { AdminDashboardComponent } from './AdminSide/admin-dashboard/admin-dashboard.component';
import { RestaurantManagementComponent } from './AdminSide/restaurant-management/restaurant-management.component';
import { DeliveryBoyStatusComponent } from './delivery-boy-status/delivery-boy-status.component';
import { MenuManagementComponent } from './AdminSide/menu-management/menu-management.component';
import { DeliveryBoysComponent } from './AdminSide/delivery-boys/delivery-boys.component';
import { CartComponent } from './cart/cart.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { AdminAuthGuard } from './admin-auth.guard';
import { DeliveryStatusCustomerComponent } from './delivery-status-customer/delivery-status-customer.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { PaymentComponent } from './payment/payment.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MenuItemListComponent } from './menu-item-list/menu-item-list.component';
import { DeliveryTrackingComponent } from './delivery-tracking/delivery-tracking.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: DeliveryloginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menu', component: MenuItemListComponent },
  { path: 'delivery-tracking/:orderId', component: DeliveryTrackingComponent },
  { path: 'profile', component: ProfileEditComponent },
  { path: 'profile/edit', component: ProfileEditComponent },

  // Customer Protected Routes (require login)
  {
    path: 'restaurants',
    component: RestaurantListComponent,
    canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'restaurant/:id', // Route to a specific restaurant's menu
    component: RestaurantDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-confirmation/:orderId', // Pass order ID after payment
    component: OrderConfirmationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery-status/:orderId', // Track specific order delivery
    component: DeliveryStatusCustomerComponent,
    canActivate: [AuthGuard]
  },


  // Admin Protected Routes (require login AND admin role)
  {
    path: 'admin',
    component: AdminDashboardComponent,
    // canActivate: [AuthGuard, AdminAuthGuard], // Protect this route with admin guard
    children: [
      { path: 'restaurants', component: RestaurantManagementComponent },
      { path: 'menu', component: MenuManagementComponent },
      { path: 'delivery-status', component: DeliveryBoyStatusComponent },
      { path: 'delivery', component: DeliveryBoysComponent },
      { path: '', redirectTo: 'restaurants', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/home' } 

    








//     { path: 'login', component: DeliveryloginComponent },
//   { path: 'deliveries', component: DeliveryComponent, canActivate: [AuthGuard]},
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: '**', redirectTo: '/login' },

// { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', component: HomeComponent },
//   { path: 'login', component: DeliveryloginComponent }, // Your login component

//   { path: 'register', component: RegisterComponent }, // Your register component

//   {
//     path: 'admin',
//     component: AdminDashboardComponent, // AdminDashboard will be the main entry for admin functions
//     // canActivate: [AuthGuard], // Protect this route
//     children: [
//       { path: 'restaurants', component: RestaurantManagementComponent },
//       { path: 'menu', component: MenuManagementComponent },
//       { path: 'delivery', component: DeliveryBoysComponent },
//       { path: '', redirectTo: 'restaurants', pathMatch: 'full' } // Default admin view
//     ]
//   },
  
//   // Add other routes as needed (e.g., individual restaurant view, cart)
  
//   { path: '**', redirectTo: '/home' }
];
