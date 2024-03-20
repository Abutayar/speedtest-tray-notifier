const { app, Tray } = require("electron");
const notifier = require("node-notifier");
const fastSpeedtest = require("fast-speedtest-api");

/**
 * @type Tray
 */
let tray = null;

app.on("ready", async () => {
  tray = new Tray("icon.png");
  tray.setToolTip("Internet Speed");

  tray.addListener("click", async () => {
    tray.setToolTip("Checking internet speed...");
    const result = await performSpeedTest();
    tray.setToolTip(`Internet Speed : ${result} Mbps`);
  });

  const result = await performSpeedTest();
  tray.setToolTip(`Internet Speed : ${result} Mbps`);
});

async function performSpeedTest() {
  try {
    const speed = await checkInternetSpeed();
    const speedMbps = speed.toFixed(2);
    speedNotifier(speedMessage(speedMbps));
    return speedMbps;
  } catch (error) {
    speedNotifier(error.message);
  }
}

const speedMessage = (speedMbps) =>
  `Your current internet speed is ${speedMbps} Mbps`;

function checkInternetSpeed() {
  const test = new fastSpeedtest({
    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // Replace with your own API token
    verbose: false,
    timeout: 10000,
    https: true,
    urlCount: 5,
    bufferSize: 8,
    unit: fastSpeedtest.UNITS.Mbps,
  });

  return test.getSpeed();
}

function speedNotifier(message) {
  notifier.notify(
    {
      appName: "Net Speed Notifier",
      sound: true,
      title: "Internet Speed",
      message,
      icon: "icon.png",
      timeout: 5,
    },
    (err, resp) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(resp);
    }
  );
}
