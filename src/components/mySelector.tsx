import { Box, Center, CheckIcon, Select } from 'native-base'
import { useState } from 'react'

type selectorProps = {
  label: string
  value: string
}

const MySelector = ({ label, value }: selectorProps) => {
  const [selector, setSelector] = useState(value)
  return (
    <Center>
      <Box w='100%' marginBottom={2} marginTop={1}>
        <Select
          fontSize={'lg'}
          color={'green.700'}
          selectedValue={selector}
          minWidth='300'
          // accessibilityLabel='Choose Service'
          // placeholder='Choose Service'
          _selectedItem={{
            bg: '#006E61',
            endIcon: <CheckIcon size='5' />,
          }}
          mt={1}
          onValueChange={(itemValue) => setSelector(itemValue)}
        >
          <Select.Item label={label} value={value} />
        </Select>
      </Box>
    </Center>
  )
}

export default MySelector
