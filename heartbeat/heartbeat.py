import os
import subprocess
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import requests
from dotenv import load_dotenv


ENV_FILE = Path(__file__).resolve().parent / ".heartbeat.env"
load_dotenv(ENV_FILE)

P4_USER = os.environ["P4_USER"]
BACKEND_URL = os.environ["BACKEND_URL"]
TIMEZONE = ZoneInfo(os.environ["TIMEZONE"])
HEARTBEAT_SECRET = os.environ["HEARTBEAT_SECRET"]


def run_p4_command(args):
    try:
        result = subprocess.run(
            ["p4", "-u", P4_USER, *args],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )

        if result.returncode != 0:
            return None

        return result.stdout.strip()

    except (subprocess.TimeoutExpired, FileNotFoundError):
        return None


def get_latest_changelist():
    output = run_p4_command([
        "-ztag",
        "changes",
        "-s",
        "submitted",
        "-m",
        "1",
    ])

    if not output:
        return None

    changelist = {}

    for line in output.splitlines():
        if not line.startswith("... "):
            continue

        parts = line.split(" ", 2)

        if len(parts) == 3:
            changelist[parts[1]] = parts[2]

    return changelist


def build_heartbeat_data(changelist):
    timestamp = int(changelist["time"])

    return {
        "latestChange": int(changelist["change"]),
        "latestChangeUser": changelist["user"],
        "latestChangeDescription": changelist["desc"],
        "latestChangeTime": datetime.fromtimestamp(
            timestamp,
            tz=TIMEZONE,
        ).isoformat(),
    }


def send_heartbeat(data):
    try:
        response = requests.post(
            BACKEND_URL,
            json=data,
            headers={
                "Authorization": f"Bearer {HEARTBEAT_SECRET}",
            },
            timeout=5,
        )

        response.raise_for_status()
        return True

    except requests.RequestException:
        return False


def main():
    if run_p4_command(["info"]) is None:
        return

    changelist = get_latest_changelist()

    if changelist is None:
        return

    send_heartbeat(build_heartbeat_data(changelist))


if __name__ == "__main__":
    main()