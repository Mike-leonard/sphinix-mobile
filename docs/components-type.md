# Component Hierarchy and Types

This document outlines all components in the project and identifies whether they are **Client Components** (`🌐`) or **Server Components** (`🖥️`).

## `app/`
- 🖥️ **layout.js** - Server Component
- 🖥️ **sitemap.js** - Server Component

## `app/(auth)/login/`
- 🌐 **page.js** - Client Component

## `app/(auth)/register/`
- 🖥️ **page.js** - Server Component

## `app/(main)/`
- 🖥️ **layout.js** - Server Component
- 🖥️ **page.js** - Server Component

## `app/(main)/_components/`
- 🌐 **HeroCarousel.jsx** - Client Component

## `app/(main)/_components/_cards/`
- 🖥️ **BlogCard.jsx** - Server Component
- 🖥️ **ProductCard.jsx** - Server Component
- 🌐 **ProductCardFooter.jsx** - Client Component
- 🖥️ **ProductCardImage.jsx** - Server Component
- 🖥️ **ProductCardSpecs.jsx** - Server Component

## `app/(main)/_components/_sections/`
- 🖥️ **BlogSection.jsx** - Server Component
- 🖥️ **ProductSection.jsx** - Server Component

## `app/(main)/activities/`
- 🖥️ **page.js** - Server Component

## `app/(main)/blogs/`
- 🖥️ **layout.js** - Server Component
- 🖥️ **page.js** - Server Component

## `app/(main)/blogs/[blogSlug]/`
- 🖥️ **page.js** - Server Component

## `app/(main)/blogs/[blogSlug]/_components/`
- 🖥️ **BlogBreadcrumb.jsx** - Server Component
- 🖥️ **BlogContent.jsx** - Server Component
- 🖥️ **BlogHero.jsx** - Server Component
- 🖥️ **BlogMeta.jsx** - Server Component
- 🖥️ **RelatedArticles.jsx** - Server Component

## `app/(main)/blogs/_components/`
- 🖥️ **BlogList.jsx** - Server Component
- 🖥️ **BlogPageHeader.jsx** - Server Component

## `app/(main)/comparisons/`
- 🖥️ **layout.js** - Server Component
- 🌐 **page.jsx** - Client Component

## `app/(main)/comparisons/_components/`
- 🖥️ **ComparisonBody.jsx** - Server Component
- 🖥️ **ComparisonBreadcrumb.jsx** - Server Component
- 🖥️ **ComparisonHeader.jsx** - Server Component
- 🖥️ **EmptyState.jsx** - Server Component

## `app/(main)/phones/`
- 🖥️ **layout.js** - Server Component
- 🖥️ **page.js** - Server Component

## `app/(main)/phones/[brandSlug]/[deviceSlug]/`
- 🖥️ **page.js** - Server Component

## `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/`
- 🖥️ **DeviceBreadcrumb.jsx** - Server Component
- 🌐 **DeviceGallery.jsx** - Client Component
- 🖥️ **DevicePageSidebar.jsx** - Server Component
- 🌐 **DeviceQuickInfo.jsx** - Client Component
- 🌐 **DeviceTabs.jsx** - Client Component
- 🌐 **RelatedDevices.jsx** - Client Component

## `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/gallery/`
- 🖥️ **constants.js** - Server Component
- 🖥️ **GalleryThumbnails.jsx** - Server Component
- 🖥️ **MainImageView.jsx** - Server Component

## `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/quick-info/`
- 🖥️ **AffiliateLinks.jsx** - Server Component
- 🖥️ **DeviceQuickInfoHeader.jsx** - Server Component
- 🖥️ **DeviceSpecBlock.jsx** - Server Component

## `app/(main)/phones/[brandSlug]/[deviceSlug]/_components/tabs/`
- 🖥️ **DeviceDescription.jsx** - Server Component
- 🌐 **ReviewsTab.jsx** - Client Component
- 🖥️ **SpecCard.jsx** - Server Component
- 🖥️ **SpecsTab.jsx** - Server Component
- 🖥️ **TabNavigation.jsx** - Server Component

## `app/(main)/phones/_components/`
- 🖥️ **DeviceGrid.jsx** - Server Component
- 🖥️ **DeviceListCard.jsx** - Server Component
- 🌐 **DeviceListCardCompare.jsx** - Client Component
- 🖥️ **MobileFiltersSheet.jsx** - Server Component
- 🖥️ **SortingControl.jsx** - Server Component

## `app/(main)/profile/`
- 🖥️ **page.js** - Server Component

## `app/@modal/`
- 🖥️ **default.js** - Server Component
- 🖥️ **page.js** - Server Component

## `app/@modal/(auth)/`
- 🖥️ **layout.js** - Server Component

## `app/@modal/(auth)/(.)login/`
- 🖥️ **page.js** - Server Component

## `app/@modal/(auth)/(.)register/`
- 🖥️ **page.js** - Server Component

## `app/@modal/[...catchAll]/`
- 🖥️ **page.js** - Server Component

## `app/api/backup/download/`
- 🖥️ **route.js** - Server Component

## `app/dashboard/`
- 🌐 **DashboardSidebar.jsx** - Client Component
- 🖥️ **layout.js** - Server Component
- 🌐 **page.js** - Client Component

## `app/dashboard/_components/`
- 🌐 **PublishTrendsChart.jsx** - Client Component
- 🌐 **SidebarFooter.jsx** - Client Component
- 🖥️ **SidebarLogo.jsx** - Server Component
- 🌐 **SidebarNav.jsx** - Client Component

## `app/dashboard/blogs/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/blogs/[id]/edit/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/blogs/_components/editor/`
- 🌐 **BlogEditor.jsx** - Client Component
- 🖥️ **BlogHeader.jsx** - Server Component
- 🖥️ **BlogSEOSettings.jsx** - Server Component
- 🖥️ **BlogSidebar.jsx** - Server Component
- 🖥️ **EditorMenuBar.jsx** - Server Component
- 🖥️ **LeaveConfirmationModal.jsx** - Server Component

## `app/dashboard/blogs/_components/manager/`
- 🖥️ **BlogsConfirmModal.jsx** - Server Component
- 🌐 **BlogsManager.jsx** - Client Component
- 🖥️ **BlogsPagination.jsx** - Server Component
- 🖥️ **BlogsTable.jsx** - Server Component
- 🖥️ **BlogsToolbar.jsx** - Server Component

## `app/dashboard/blogs/categories/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/blogs/categories/_components/`
- 🖥️ **CategoryForm.jsx** - Server Component
- 🖥️ **CategoryList.jsx** - Server Component
- 🌐 **CategoryManager.jsx** - Client Component
- 🖥️ **DeleteCategoryModal.jsx** - Server Component

## `app/dashboard/blogs/new/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/[id]/edit/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/_components/editor/`
- 🌐 **DeviceBasicInfo.jsx** - Client Component
- 🌐 **DeviceDetailedSpecs.jsx** - Client Component
- 🌐 **DeviceEditor.jsx** - Client Component
- 🌐 **DeviceEditorSidebar.jsx** - Client Component
- 🌐 **DeviceExpertRatings.jsx** - Client Component
- 🌐 **DeviceOverviewEditor.jsx** - Client Component
- 🌐 **DeviceQuickSpecs.jsx** - Client Component

## `app/dashboard/phones/_components/manager/`
- 🌐 **DevicesConfirmModal.jsx** - Client Component
- 🌐 **DevicesManager.jsx** - Client Component
- 🌐 **DevicesPagination.jsx** - Client Component
- 🌐 **DevicesTable.jsx** - Client Component
- 🌐 **DevicesToolbar.jsx** - Client Component
- 🌐 **DeviceTabsRoute.jsx** - Client Component

## `app/dashboard/phones/attributes/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/attributes/_components/`
- 🌐 **AttributeManager.jsx** - Client Component

## `app/dashboard/phones/brands/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/brands/_components/`
- 🌐 **BrandManager.jsx** - Client Component

## `app/dashboard/phones/filters/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/filters/_components/`
- 🌐 **FilterManager.jsx** - Client Component

## `app/dashboard/phones/groups/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/groups/_components/`
- 🌐 **GroupManager.jsx** - Client Component

## `app/dashboard/phones/new/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/rating-bars/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/phones/rating-bars/_components/`
- 🌐 **RatingBarManager.jsx** - Client Component

## `app/dashboard/reviews/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/`
- 🌐 **layout.js** - Client Component
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/advertisements/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/advertisements/_components/`
- 🖥️ **AdPlacementsSection.jsx** - Server Component
- 🌐 **AdvertisementsForm.jsx** - Client Component
- 🖥️ **GlobalAdControl.jsx** - Server Component
- 🖥️ **InjectionFrequencySection.jsx** - Server Component
- 🖥️ **NetworkConfigSection.jsx** - Server Component

## `app/dashboard/settings/ai-configuration/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/ai-configuration/_components/`
- 🌐 **AiConfigurationForm.jsx** - Client Component
- 🖥️ **AiToggleSection.jsx** - Server Component
- 🖥️ **PromptConfigurationSection.jsx** - Server Component
- 🖥️ **ProviderSelectionSection.jsx** - Server Component

## `app/dashboard/settings/analytics/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/analytics/_components/`
- 🌐 **AnalyticsForm.jsx** - Client Component
- 🖥️ **GoogleIdsSection.jsx** - Server Component
- 🖥️ **VisitorStatsSection.jsx** - Server Component

## `app/dashboard/settings/appearance/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/appearance/_components/`
- 🌐 **AppearanceForm.jsx** - Client Component
- 🖥️ **LayoutLimitsSection.jsx** - Server Component
- 🖥️ **ThemeConfigurationSection.jsx** - Server Component

## `app/dashboard/settings/comments/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/comments/_components/`
- 🌐 **CommentsForm.jsx** - Client Component

## `app/dashboard/settings/localization/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/localization/_components/`
- 🌐 **LocalizationForm.jsx** - Client Component

## `app/dashboard/settings/maintenance/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/maintenance/_components/`
- 🌐 **MaintenanceForm.jsx** - Client Component
- 🖥️ **MaintenanceStatusBanner.jsx** - Server Component
- 🖥️ **MaintenanceToggleSection.jsx** - Server Component

## `app/dashboard/settings/media/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/media/_components/`
- 🖥️ **CdnConfigurationSection.jsx** - Server Component
- 🖥️ **ImageOptimizationSection.jsx** - Server Component
- 🌐 **MediaForm.jsx** - Client Component
- 🖥️ **UploadLimitsSection.jsx** - Server Component

## `app/dashboard/settings/security/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/security/_components/`
- 🖥️ **AccessSecuritySection.jsx** - Server Component
- 🖥️ **BackupSection.jsx** - Server Component
- 🖥️ **RecaptchaSection.jsx** - Server Component
- 🌐 **SecurityForm.jsx** - Client Component

## `app/dashboard/settings/seo-metadata/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/seo-metadata/_components/`
- 🖥️ **AdvancedSeoSection.jsx** - Server Component
- 🖥️ **GeneralSeoSection.jsx** - Server Component
- 🖥️ **OpenGraphSection.jsx** - Server Component
- 🌐 **SeoMetadataForm.jsx** - Client Component

## `app/dashboard/settings/social-media/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/social-media/_components/`
- 🌐 **SocialMediaForm.jsx** - Client Component

## `app/dashboard/settings/typography/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/settings/typography/_components/`
- 🖥️ **constants.js** - Server Component
- 🖥️ **TypographyFieldCard.jsx** - Server Component
- 🌐 **TypographyForm.jsx** - Client Component

## `app/dashboard/users/`
- 🖥️ **page.js** - Server Component

## `app/dashboard/users/_components/`
- 🖥️ **UserRow.jsx** - Server Component
- 🌐 **UsersTable.jsx** - Client Component
- 🖥️ **UsersTablePagination.jsx** - Server Component
- 🖥️ **UsersTableToolbar.jsx** - Server Component

## `app/maintenance/`
- 🖥️ **page.js** - Server Component

## `app/robots.txt/`
- 🖥️ **route.js** - Server Component

## `components/`
- 🌐 **AdvancedFilters.jsx** - Client Component
- 🌐 **AuthModal.jsx** - Client Component
- 🌐 **CompareDrawer.jsx** - Client Component
- 🖥️ **DynamicStyles.jsx** - Server Component
- 🖥️ **Footer.jsx** - Server Component
- 🌐 **Pagination.jsx** - Client Component
- 🌐 **Search.jsx** - Client Component
- 🖥️ **StructuredData.jsx** - Server Component

## `components/ads/`
- 🌐 **AdBanner.jsx** - Client Component
- 🌐 **InFeedAd.jsx** - Client Component

## `components/navbar/`
- 🌐 **DesktopNav.jsx** - Client Component
- 🌐 **MobileNav.jsx** - Client Component
- 🌐 **Navbar.jsx** - Client Component
- 🌐 **UserProfileDropdown.jsx** - Client Component

## `components/sidebar/`
- 🖥️ **BrandList.jsx** - Server Component
- 🖥️ **Categories.jsx** - Server Component
- 🖥️ **NewArrivals.jsx** - Server Component
- 🖥️ **RightSidebar.jsx** - Server Component
- 🖥️ **TopRated.jsx** - Server Component
- 🖥️ **TrendingBlogsSidebar.jsx** - Server Component

## `components/ui/`
- 🖥️ **badge.jsx** - Server Component
- 🖥️ **button.jsx** - Server Component
- 🖥️ **card.jsx** - Server Component
- 🖥️ **input.jsx** - Server Component
- 🌐 **sheet.jsx** - Client Component
