/**
 * The plan settings panel shown in the sidebar's settings popup
 * (`settings.render`). It edits the same catalog the tab reads: selection,
 * calculation mode, manual plan create/duplicate/edit/delete, and the
 * restore-built-ins action for an unreadable stored blob.
 *
 * Official plans are read-only; the panel duplicates one into a manual plan
 * before any rate edit, and it refuses to delete the last remaining plan.
 * Writes go through the shared serialized catalog writer, so an edit made
 * here and one made in the tab cannot interleave.
 *
 * @module dsh-price-monitor/client/PricePlanSettings
 */
import type { SidebarSettingsRenderProps } from 'dsh-better-sidebar/client/service';
import { SETTINGS_KEY } from './settings-write.ts';
/**
 * Render the plan settings panel.
 * @param props - settings render props (plugin blob plus the update helper).
 * @returns the settings panel.
 */
export declare function PricePlanSettings(props: SidebarSettingsRenderProps): React.ReactElement;
export { SETTINGS_KEY };
