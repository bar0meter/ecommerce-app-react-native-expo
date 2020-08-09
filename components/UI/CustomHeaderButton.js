import React from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../../constants/Colors'

const CustomHeaderButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onBtnClick}>
      <Ionicons
        name={props.btnIcon}
        size={25}
        color={Platform.OS === 'android' ? 'white' : Colors.primary}
        style={{
          marginHorizontal: 20
        }}
      />
    </TouchableOpacity>
  )
}

export default CustomHeaderButton
