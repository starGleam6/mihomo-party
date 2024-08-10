import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import MonacoEditor, { monaco } from 'react-monaco-editor'
import { useTheme } from 'next-themes'
import { getRuntimeConfigStr } from '@renderer/utils/ipc'
interface Props {
  onClose: () => void
}
const ConfigViewer: React.FC<Props> = (props) => {
  const { onClose } = props
  const [currData, setCurrData] = useState('')
  const { theme } = useTheme()

  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor): void => {
    window.electron.ipcRenderer.on('resize', () => {
      editor.layout()
    })
  }

  const editorWillUnmount = (editor: monaco.editor.IStandaloneCodeEditor): void => {
    window.electron.ipcRenderer.removeAllListeners('resize')
    editor.dispose()
  }

  const getContent = async (): Promise<void> => {
    setCurrData(await getRuntimeConfigStr())
  }

  useEffect(() => {
    getContent()
  }, [])

  return (
    <Modal size="5xl" hideCloseButton isOpen={true} onOpenChange={onClose} scrollBehavior="inside">
      <ModalContent className="h-full w-[calc(100%-100px)]">
        <ModalHeader className="flex">当前运行时配置</ModalHeader>
        <ModalBody className="h-full">
          <MonacoEditor
            height="100%"
            language="yaml"
            value={currData}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
            options={{
              readOnly: true,
              minimap: {
                enabled: false
              },
              mouseWheelZoom: true,
              fontFamily: `Fira Code, JetBrains Mono, Roboto Mono, "Source Code Pro", Consolas, Menlo, Monaco, monospace, "Courier New", "Apple Color Emoji", "Noto Color Empji"`,
              fontLigatures: true, // 连字符
              smoothScrolling: true // 平滑滚动
            }}
            editorDidMount={editorDidMount}
            editorWillUnmount={editorWillUnmount}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfigViewer