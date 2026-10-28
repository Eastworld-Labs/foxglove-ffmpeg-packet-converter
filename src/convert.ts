/**
 * Turns one `ffmpeg_image_transport_msgs/msg/FFMPEGPacket` (an encoded video frame published by the
 * ROS 2 ffmpeg_image_transport) into a `foxglove.CompressedVideo`, which Foxglove's Image panel plays.
 *
 * Pure functions, no Foxglove imports, so they can be tested with `node --test`.
 */

/** A ROS 2 time as Foxglove parses it: `nanosec`. Some sources use `nsec`; both are read. */
interface RosTime {
  sec?: number;
  nanosec?: number;
  nsec?: number;
}

/** The fields of FFMPEGPacket this converter reads (the rest, such as width, height and pts, are not needed). */
export interface FfmpegPacket {
  header?: { stamp?: RosTime; frame_id?: string };
  /** The codec first, then the pixel formats the transport lists, e.g. "h264;nv12;bgr8;rgb8". */
  encoding?: string;
  data?: Uint8Array;
}

/** The fields of foxglove.CompressedVideo. */
export interface CompressedVideo {
  timestamp: { sec: number; nsec: number };
  frame_id: string;
  data: Uint8Array;
  format: string;
}

export const FROM_SCHEMA = "ffmpeg_image_transport_msgs/msg/FFMPEGPacket";
export const TO_SCHEMA = "foxglove.CompressedVideo";

/** What the Image panel calls each codec. The transport uses libav names. */
const FORMATS: Record<string, string> = {
  h264: "h264",
  avc: "h264",
  avc1: "h264",
  h265: "h265",
  hevc: "h265",
  av1: "av1",
  vp9: "vp9",
};

/** "h264;nv12;bgr8;rgb8" -> "h264". An unknown codec is passed through lower-cased so it is visible, not hidden. */
export function formatOf(encoding: string | undefined): string {
  const codec = (encoding ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
  return FORMATS[codec] ?? codec;
}

export function convertFfmpegPacket(packet: FfmpegPacket): CompressedVideo {
  const stamp = packet.header?.stamp ?? {};
  return {
    timestamp: { sec: stamp.sec ?? 0, nsec: stamp.nanosec ?? stamp.nsec ?? 0 },
    frame_id: packet.header?.frame_id ?? "",
    data: packet.data ?? new Uint8Array(),
    format: formatOf(packet.encoding),
  };
}
