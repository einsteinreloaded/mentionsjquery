# mentionsjquery
Facebook like mentioning plugin.
This plugin is an improvement on https://github.com/ivirabyan/jquery-mentions


Bug Fixes and Improvements:

1. minchars to trigger the search
2. autocomplete dropdown at cursor issue fixed.
3. caret going to begining on selecting tag in IE Edge browser fixed.
4. Mozila browser highlighting div slides down the textarea fixed.
5. Added autoheight increase function to a max height which can be set by the user.

## Usage
For this plugin to work you need to include [jQuery Autocomplete](http://jqueryui.com/autocomplete/) to your page.

```
var data = [
    {value: 'alex', uid: 'user:1'},
    {value: 'andrew', uid: 'user:2'},
    {value: 'angry birds', uid: 'game:5'},
    {value: 'assault', uid: 'game:3'}
];

$('textarea').mentionsInput({source: data});
```

Remote datasource (ajax):

```
$('textarea').mentionsInput({source: 'http://example.com/users.json'})
```
The url is given a query paremeter `term`, like `http://example.com/users.json?term=Foo` and must return a json list of matched values (like the above).

Calling a method:
```
$('textarea').mentionsInput('getValue');
$('textarea').mentionsInput('setValue', 'Hello, @[Alex](user:1)');
```

Getting value:
`$('textarea').mentionsInput('getValue')` -> `Hello, @[Alex](user:1)`
`$('textarea').mentionsInput('getRawValue')` -> `Hello, Alex`

Don't use textarea value directly, because it contains special characters, used by plugin internally. Always use methods.

##### WYSIWYG editors
To create WYSIWYG editor on your site, usually you create `<textarea>` tag, and then your editor replaces it with editor's visual representation, including element with `contenteditable="true"` attribute. So, to make `mentionsInput` plugin work, you need to apply the plugin to element  with `contenteditable="true"`. If you apply the plugin to your `<textarea>`, it'll not work.
For example:
```
    <textarea id="content"></textarea>
    <script>
        $('#content').myEditor();
        // Now your editor is initialized, find element with contenteditable.
        // For particular plugin you may find a better way to get such an element,
        // maybe even write your own plugin.
        var elEditable = $('[contenteditable=true]');
        elEditable.mentionsInput({...});
    </script>
```

## Options
minchars // to be specified inside the js file

Minimum number of characters needed to trigger search.

showAtCaret // to be specified inside the js file

boolean : true - to set the autocomplete dropdown at cursor 
          false - to show the dropdown below the textarea only.

#### source
  Data source for the autocomplete. See [jQuery Autocomplete API](http://api.jqueryui.com/autocomplete/#option-source) for available values.
  
  Source data is an array of objects with `uid` and `value` properties: `[{uid: '123', value: 'Alex'}, ...]`. If you want to display an icon in dropdown list, you can add an `image` property to objects in the array.

### suffix
  String to add to selected mention when it is inserted in text. Can be usefull if you wish to automatically insert a space after mention. For that case: `$textarea.mentionsInput({suffix: ' '})`
  Note: only supported for textarea and input. Contenteditable does not support this option yet.

#### trigger
  Char which trigger autocomplete, default value is '@'

#### widget
  Name of the autocomplete widget to use. May be useful when you want to somehow customize appearance of autocomplete widget, for example add headers to items list. You must inherit from widget, used internally (`ui.areacomplete` when you use textarea, and `ui.editablecomplete` when you use div with `contenteditable=true`).

#### autocomplete
  Options to pass to jQuery Autocomplete widget. Default is `{delay: 0, autoFocus: true}`.

## Methods

#### getValue()
  Returns marked up value.

#### getRawValue()
  Returns value without any markup

#### setValue(value)
  Takes marked up value as an argument. For example `'Hey, @[alex](user:1)'`.
  You can also represent mentions as objects, instead of manually marking them up:
  `$textarea.mentionsInput('setValue', 'Hey, ', {name: 'alex', uid: 'user:1'})`

#### getMentions()
  Returns an array of all mentions contained within the text, like this:
  ```
  [
    {name: 'alex', uid: 'user:1'},
    {name: 'andrew', uid: 'user:2'}
  ]
  ```

#### clear()
  Clears value. Note that you must use this method insted of manually clearing value of the input

#### destroy()
  Destroys current instance of the plugin
