/**
 * The refresh-confirmation panel: shows the field-level diff between the
 * bundled/last official catalog and the candidate the host route just fetched,
 * and applies it only when the user confirms. Applying appends new immutable
 * official plans (new ids); it never overwrites a previous version, so
 * historical comparisons keep working.
 *
 * @module dsh-price-monitor/client/OfficialDiffPanel
 */
import type { SidebarStore } from 'dsh-better-sidebar/client/service';
export interface OfficialDiffPanelProps {
    onClose: () => void;
    /** The sidebar store the panel writes the confirmed catalog through. */
    store: SidebarStore;
}
/**
 * Fetch the candidate from the host route and render its diff for confirmation.
 * @param props - the close callback and the store the confirmed catalog is written through.
 * @returns the confirmation panel.
 */
export declare function OfficialDiffPanel({ onClose, store }: OfficialDiffPanelProps): React.ReactElement;
