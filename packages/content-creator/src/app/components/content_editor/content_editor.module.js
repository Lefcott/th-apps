/** @format */

"use strict";

import angular from "angular";
import GlobalController from "./global/global.controller";
import { ActionBarComponentConfig } from "./action_bar/action-bar.component";
import { ActionMenuComponentConfig } from "./action_bar_menu/action-menu.component";
import { ClearModalComponentConfig } from "./clearModal/clear.component";
import { DeleteModalComponentConfig } from "./delete_page_modal/delete.page.component";
import { ConfirmationModalComponentConfig} from "./confirmationModal/confirmation.modal.component";
import { PageDurationComponentConfig } from "./page_duration/page.duration.component";
import { PageOrderComponentConfig } from "./page_order/page_order.component";
import { PagePropertiesComponentConfig } from "./page_properties/pageproperties.component";
import { PageControlsComponentConfig } from "./page_controls/page_controls.component";
import { PageAddComponentConfig } from "./page_controls/add/page_add.component";
import { PageRemoveComponentConfig } from "./page_controls/remove/page_remove.component";
import { PortalComponentConfig } from "./portal/portal.component";
import { SubmitComponentConfig } from "./submit/submit.component";
import { SwitchModalComponentConfig } from "./switchModal/switch.component";
import { ZoomComponentConfig } from "./zoom/zoom.component";
import { BackgroundColorConfig } from "./properties/background-color/background-color.component";
import { RotationComponentConfig } from "./properties/rotation/rotation.component";
import { OpacityComponentConfig } from "./properties/opacity/opacity.component";
import { CalendarPropertiesComponentConfig } from "./properties/calendarProperties/calendarProperties.component";
import { MaximizeComponentConfig } from "./properties/maximize/maximize.component";
import { DepthComponentConfig } from "./properties/depth/depth.component";
import { BorderComponentConfig } from "./properties/border/border.component";
import { LineWidthComponentConfig } from "./properties/line-width/line-width.component";
import { ImageComponentConfig } from "./image/image.component";
import { ImageUploadComponentConfig } from "./image-upload/image-upload.component";
import { RemoveElementComponentConfig } from "./properties/remove/remove.component";
import { TextComponentConfig } from "./text/text.component";
import { ResizeControlComponentConfig } from "./templateControls/resize/resize.control.component";
import { DragControlComponentConfig } from "./templateControls/drag/drag.control.component";
import { StyleControlComponentConfig } from "./templateControls/style/style.control.component";
import { ContentControlComponentConfig } from "./templateControls/content/content.control.component";
import { DatePickerComponentConfig } from "./properties/date-picker/date-picker.component";
import { CalendarPickerComponentConfig } from "./properties/calendar-picker/calendar-picker.component";
import { UndoRedoComponentConfig } from "./undo_redo/undo-redo.component";
import { ExternalSrcComponentConfig } from "./properties/external-src/external-src.component";
import { MonthCalendarV2ComponentConfig } from "./widgets/month-calendar-v2/month.calendar.v2.component";
import { MenuDailyComponentConfig } from "./widgets/menu-daily/menu.daily.component";
import { MenuWeeklyComponentConfig } from "./widgets/menu-weekly/menu.weekly.component";
import { RestaurantPickerComponentConfig } from "./properties/dining/restaurant-picker/restaurant-picker.component";
import { HeaderPropertiesComponentConfig } from "./properties/dining/header-properties-component/header-properties.component";
import { MenuPickerComponentConfig } from "./properties/dining/menu-picker/menu-picker.component";
import { MenuWeekPickerComponentConfig } from "./properties/dining/menu-week-picker/menu-week-picker.component";
import { MenuMealPickerComponentConfig } from "./properties/dining/menu-meal-picker/menu-meal-picker.component";
import { MenuMealMultiPickerComponentConfig } from "./properties/dining/menu-meal-multi-picker/menu-meal-multi-picker.component";
import { MenuDayPickerComponentConfig } from "./properties/dining/menu-day-picker/menu-day-picker.component";
import { MenuPropertiesComponentConfig } from "./properties/dining/menu-properties/menu-properties.component";
import { DiningComponentConfig } from "./properties/dining/dining.component";
import { MenuItemPickerComponentConfig } from "./properties/dining/menu-item-picker/menu-item-picker.component";
import { MenuOpacitySliderComponentConfig } from "./properties/dining/menu-opacity-slider/menu-opacity-slider.component";

export const ContentEditorModule = angular
	.module("contentEditor", ["ui.router", "ui.bootstrap"])
	.component("actionBarComponent", ActionBarComponentConfig)
	.component("actionMenuComponent", ActionMenuComponentConfig)
	.component("clearModalComponent", ClearModalComponentConfig)
	.component("deleteModalComponent", DeleteModalComponentConfig)
	.component("confirmationModalComponent", ConfirmationModalComponentConfig)
	.controller("globalController", GlobalController)
	.component("pageDurationComponent", PageDurationComponentConfig)
	.component("pageOrderComponent", PageOrderComponentConfig)
	.component("pagePropertiesComponent", PagePropertiesComponentConfig)
	.component("pageControlsComponent", PageControlsComponentConfig)
	.component("pageAddComponent", PageAddComponentConfig)
	.component("pageRemoveComponent", PageRemoveComponentConfig)
	.component("portalComponent", PortalComponentConfig)
	.component("submitComponent", SubmitComponentConfig)
	.component("switchModalComponent", SwitchModalComponentConfig)
	.component("zoomComponent", ZoomComponentConfig)
	.component("backgroundColorPicker", BackgroundColorConfig)
	.component("rotationComponent", RotationComponentConfig)
	.component("opacityComponent", OpacityComponentConfig)
	.component("diningComponent", DiningComponentConfig)
	.component("calendarPropertiesComponent", CalendarPropertiesComponentConfig)
	.component("maximizeComponent", MaximizeComponentConfig)
	.component("depthComponent", DepthComponentConfig)
	.component("borderComponent", BorderComponentConfig)
	.component("lineWidthComponent", LineWidthComponentConfig)
	.component("imageComponent", ImageComponentConfig)
	.component("imageUpload", ImageUploadComponentConfig)
	.component("removeElementComponent", RemoveElementComponentConfig)
	.component("textComponent", TextComponentConfig)
	.component("resizeControlComponent", ResizeControlComponentConfig)
	.component("dragControlComponent", DragControlComponentConfig)
	.component("controlStyleComponent", StyleControlComponentConfig)
	.component("contentControlComponent", ContentControlComponentConfig)
	.component("datePickerComponent", DatePickerComponentConfig)
	.component("calendarPickerComponent", CalendarPickerComponentConfig)
	.component("restaurantPickerComponent", RestaurantPickerComponentConfig)
	.component("headerPropertiesComponent", HeaderPropertiesComponentConfig)
	.component("menuPickerComponent", MenuPickerComponentConfig)
	.component("menuWeekPickerComponent", MenuWeekPickerComponentConfig)
	.component("menuMealPickerComponent", MenuMealPickerComponentConfig)
	.component("menuMealMultiPickerComponent", MenuMealMultiPickerComponentConfig)
	.component("menuItemPickerComponent", MenuItemPickerComponentConfig)
	.component("menuDayPickerComponent", MenuDayPickerComponentConfig)
	.component("menuOpacitySliderComponent", MenuOpacitySliderComponentConfig)
	.component("menuPropertiesComponent", MenuPropertiesComponentConfig)
	.component("undoRedoComponent", UndoRedoComponentConfig)
	.component("monthCalendarV2", MonthCalendarV2ComponentConfig)
	.component("menuDailyWidget", MenuDailyComponentConfig)
	.component("menuWeeklyWidget", MenuWeeklyComponentConfig)
	.component("externalSrcComponent", ExternalSrcComponentConfig).name;
