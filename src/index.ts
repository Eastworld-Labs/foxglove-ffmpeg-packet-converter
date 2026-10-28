import { ExtensionContext } from "@foxglove/extension";

import { FROM_SCHEMA, TO_SCHEMA, convertFfmpegPacket, FfmpegPacket } from "./convert";

export function activate(extensionContext: ExtensionContext): void {
  // Foxglove then lists every FFMPEGPacket topic a second time as foxglove.CompressedVideo,
  // which the Image panel can show.
  extensionContext.registerMessageConverter({
    type: "schema",
    fromSchemaName: FROM_SCHEMA,
    toSchemaName: TO_SCHEMA,
    converter: (packet: FfmpegPacket) => convertFfmpegPacket(packet),
  });
}
