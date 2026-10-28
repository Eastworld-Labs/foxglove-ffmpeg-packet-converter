import assert from "node:assert/strict";
import { test } from "node:test";

import { convertFfmpegPacket, formatOf } from "../src/convert.ts";

test("an h264 packet becomes a CompressedVideo with the same bytes and time", () => {
  const data = Uint8Array.from([0, 0, 0, 1, 0x67, 0x42]);
  const out = convertFfmpegPacket({
    header: { stamp: { sec: 1765519223, nanosec: 7444000 }, frame_id: "das_center_optical_frame" },
    encoding: "h264;nv12;bgr8;rgb8",
    data,
  });
  assert.deepEqual(out.timestamp, { sec: 1765519223, nsec: 7444000 });
  assert.equal(out.frame_id, "das_center_optical_frame");
  assert.equal(out.format, "h264");
  assert.equal(out.data, data);
});

test("codec names map to the names the Image panel uses", () => {
  assert.equal(formatOf("hevc;nv12"), "h265");
  assert.equal(formatOf("H264"), "h264");
  assert.equal(formatOf("av1"), "av1");
  assert.equal(formatOf("somethingelse;x"), "somethingelse");
  assert.equal(formatOf(undefined), "");
});

test("a packet with missing fields still converts without throwing", () => {
  const out = convertFfmpegPacket({});
  assert.deepEqual(out.timestamp, { sec: 0, nsec: 0 });
  assert.equal(out.data.length, 0);
  assert.equal(out.format, "");
});
