InsertTextView = require './insert-text-view'
{CompositeDisposable} = require 'atom'

module.exports = InsertText =
  insertTextView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @insertTextView = new InsertTextView(state.insertTextViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @insertTextView.getElement(), visible: false)
    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'insert-text:insertCode': => @insertCode()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @insertTextView.destroy()

  insertCode: (code) ->
    if editor    = atom.workspace.getActiveTextEditor()
      current    = editor.getBuffer().getText()
      current    = current.split("\n")
      newLines   = code.split("\n")
      difference = []
      for item in newLines
        if current.indexOf(item) == -1
          difference.push(item)
      editor.getBuffer().setText(code)


  serialize: ->
    insertTextViewState: @insertTextView.serialize()

  toggle: ->
    console.log 'InsertText was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
