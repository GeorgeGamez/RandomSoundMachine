# Random Sound Machine

A customizable browser-based random sound generator.

## Features

* Supports local and online sounds
* Supports random clips of longer sounds
* Supports multiple variations of sounds
* Adjustable time delay between plays
* Master volume control

## Getting Started

To create your own configuration file, scroll down to the next section.

1. Download either the online or local test file(s).
2. Open the [web interface](https://georgegamez.github.io/RandomSoundMachine/) in your browser.
3. Upload the file(s) to the web page. The online version only requires the JSON file.
4. Click **Open Sound Machine**.
5. Check the boxes of the sounds you would like to use and configure the time delays.
6. Press the **Start Generator** button.

## Creating a Configuration File

1. Prepare sound files in a folder on your computer, or prepare links to online sounds.
2. Open a text editor, such as Notepad.
3. Create a new JSON file containing the following:

```json
{
  "sounds": [

  ]
}
```

4. Inside the brackets (`[]`), add the following sample entry for each sound you want to add. Remove the final comma from the last entry.

```json
{
  "name": "Example",
  "id": "change_me",
  "location": "local/online",
  "type": "single/group",
  "mode": "short/long",
  "file": "https://example.com/sound1.mp3 | sounds/sound.mp3",
  "defaultRate": 60
}
```

5. Configure the entry according to the field reference below. You may need to add or remove fields depending on the sound type. The order of fields does not matter.

6. Save the file as `list.json`.

7. If you are using local sounds, place all sound files into the folder structure specified in your configuration file.

8. Compress the sound folder into a `.zip` file.

   * On Linux, right-click the folder and select **Compress**.
   * On Windows, right-click the folder, select **Show more options**, then choose **Send to > Compressed (zipped) folder**.

9. Open the [web interface](https://georgegamez.github.io/RandomSoundMachine/) in your browser.

10. Upload the required file(s) to the web page.

## JSON Field Reference

### Common Fields

| Field         | Type   | Required | Description                               |
| ------------- | ------ | :------: | ----------------------------------------- |
| `name`        | String |     ✓    | Display name shown in the sound list.     |
| `id`          | String |     ✓    | Unique identifier used by the program.    |
| `location`    | String |     ✓    | Either `local` or `online`.               |
| `type`        | String |     ✓    | Either `single` or `group`.               |
| `mode`        | String |     ✓    | Either `short` or `long`.                 |
| `defaultRate` | Number |     ✓    | Average interval between plays (seconds). |

### Single Sounds

| Field  | Type   | Required | Description                                 |
| ------ | ------ | :------: | ------------------------------------------- |
| `file` | String |     ✓    | Local file path or online URL to the sound. |

### Numbered Local Groups

| Field       | Type   | Required | Description                                         |
| ----------- | ------ | :------: | --------------------------------------------------- |
| `folder`    | String |     ✓    | Folder containing the sound files.                  |
| `count`     | Number |     ✓    | Number of sound files in the folder.                |
| `digits`    | Number |    No    | Number of digits used for numbering (default: `2`). |
| `extension` | String |    No    | File extension (default: `mp3`).                    |

### Custom Groups

| Field   | Type   | Required | Description                                                              |
| ------- | ------ | :------: | ------------------------------------------------------------------------ |
| `files` | Object |     ✓    | Dictionary containing file names or URLs. Keys can be any unique values. |
