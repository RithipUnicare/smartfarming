# Screen Wrapper Update Guide

All screens have been updated to use the `ScreenWrapper` component which provides:

- SafeAreaView with edges: ['top', 'bottom', 'left', 'right']
- KeyboardAvoidingView with:
  - iOS behavior: 'padding'
  - Android behavior: 'height'
  - Android keyboardVerticalOffset: 40

## Updated Screens:

✅ LoginScreen
✅ SignupScreen

## Screens Remaining to Update:

The following screens need to be wrapped with ScreenWrapper:

### Auth Screens:

- ForgotPasswordScreen
- ResetPasswordScreen

### Farmer Screens:

- AddCropScreen
- MyCropsScreen
- CropRecommendationScreen
- FarmerProfileSetupScreen

### Buyer Screens:

- MarketplaceScreen
- CropDetailBuyerScreen
- MyOrdersScreen (already has error handling from earlier)
- BuyerProfileSetupScreen

### Admin Screens:

- AdminDashboardScreen
- UserManagementScreen
- PendingCropsScreen
- UpdateRoleScreen

### Common Screens:

- ProfileScreen
- EditProfileScreen
- HomeScreen

## Pattern to Follow:

1. Add import:

```typescript
import { ScreenWrapper } from '../../components/ScreenWrapper';
// or '../../../components/ScreenWrapper' for nested screens
```

2. Wrap the return statement:

```typescript
return <ScreenWrapper>{/* existing content */}</ScreenWrapper>;
```

3. Remove any existing KeyboardAvoidingView or SafeAreaView wrapping
