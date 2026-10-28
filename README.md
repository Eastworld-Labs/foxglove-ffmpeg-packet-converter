# FFMPEGPacket to CompressedVideo (Foxglove extension)

Foxglove's Image panel plays `foxglove.CompressedVideo`, but ROS 2 recordings made with
[`ffmpeg_image_transport`](https://docs.ros.org/en/humble/p/ffmpeg_image_transport/) store each video frame
as an `ffmpeg_image_transport_msgs/msg/FFMPEGPacket`, which Foxglove does not recognise as video.

This extension registers a **schema message converter** from `ffmpeg_image_transport_msgs/msg/FFMPEGPacket`
to `foxglove.CompressedVideo`:

| FFMPEGPacket | CompressedVideo |
|---|---|
| `header.stamp` | `timestamp` |
| `header.frame_id` | `frame_id` |
| `data` (H.264 / H.265 Annex B bytes) | `data` |
| `encoding` (`h264;nv12;bgr8;rgb8`: the codec comes first) | `format` (`h264`, `h265`, `av1`, `vp9`) |

Nothing is decoded here: the bytes are passed through and Foxglove decodes them with WebCodecs, so the
first message the panel sees on a topic should be a keyframe (the ffmpeg transport starts streams with one).

## Use

```bash
npm install
npm test            # unit tests of the conversion
npm run package     # writes a .foxe file
```

Install the `.foxe` by dragging it into Foxglove (or `npm run local-install` for the desktop app).
Then open the recording, add an **Image** panel and pick the topic that ends in
`(foxglove.CompressedVideo)` (the converter lists every FFMPEGPacket topic a second time under that schema).

Checked on WAGMI recordings: three 640x480 H.264 streams, `/center_camera/image_raw/ffmpeg`,
`/left_camera/image_raw/ffmpeg`, `/right_camera/image_raw/ffmpeg`.
