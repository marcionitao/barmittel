import { Icon } from '@rneui/themed'
import { useState } from 'react'
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import MonthPicker from 'react-native-month-year-picker'
import moment from 'moment'

type Props = {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  handlePreviousMonth: () => void
  handleNextMonth: () => void
  handleCurrentMonth: () => void
}

export default function MonthNavigator({
  currentMonth,
  setCurrentMonth,
  handlePreviousMonth,
  handleNextMonth,
  handleCurrentMonth,
}: Props) {
  const [show, setShow] = useState(false)

  const onChange = (event: string, newDate?: Date) => {
    setShow(false)

    if (event === 'neutralAction') {
      handleCurrentMonth()
    } else if (event === 'dateSetAction' && newDate) {
      setCurrentMonth(newDate)
    }
  }

  const today = new Date()
  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  )

  const selected = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  )

  const isCurrentMonth = selected >= current

  const showAlert = () => {
    Alert.alert(
      'Sorry!',
      "There aren't datas from next month!",
    )
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <TouchableOpacity onPress={handlePreviousMonth}>
        <Icon
          name="chevron-back"
          type="ionicon"
          color="gray"
          size={26}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => setShow(true)}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {moment(currentMonth).format('MMMM YYYY')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (isCurrentMonth) return showAlert()
          handleNextMonth()
        }}
      >
        <Icon
          name="chevron-forward"
          type="ionicon"
          color={isCurrentMonth ? '#ccc' : 'gray'}
          size={26}
        />
      </TouchableOpacity>

      {show && (
        <MonthPicker
          onChange={onChange}
          value={currentMonth}
          minimumDate={new Date(2019, 0, 1)}
          maximumDate={today}
          locale="en"
          okButton='OK'
          cancelButton='Cancel'
          neutralButton='Hoje'
        />
      )}
    </View>
  )
}