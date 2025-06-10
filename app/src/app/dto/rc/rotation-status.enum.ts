/**
 * Rotation status enum matching the backend definition:
 * 
 * @RequiredArgsConstructor
 * public enum RotationStatus {
 *   ONSITE("on-site"),
 *   REMOTE("remote");
 *   public final String value;
 * 
 *   @JsonValue
 *   String getValue(){
 *     return value;
 *   }
 * }
 */
export enum RotationStatus {
  ONSITE = 'on-site',
  REMOTE = 'remote'
}
