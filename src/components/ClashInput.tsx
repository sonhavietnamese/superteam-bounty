import React, { ChangeEvent, ChangeEventHandler, forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`

const InputTitle = styled.span`
  font-size: 16px;
  color: #fff;
  font-family: 'CD-M';
  margin-left: 24px;
`

const InputFieldContainer = styled.div`
  position: relative;
`

const InputField = styled.input`
  /* border: 1px solid #ffffff; */
  border: none;
  border-radius: 27px;
  padding: 12px 24px;
  font-size: 20px;
  font-family: 'Circular-M';
  width: 100%;
`

const WordCounterContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
`

const Counter = styled.span`
  color: #737373;
  font-family: 'Circular-M';
`

type InputProps = {
  title: string
  placeholder: string
  counter?: boolean
  maximumWords?: number
  type?: 'number' | 'text'
}

const ClashInput = forwardRef<HTMLInputElement, InputProps>(
  ({ title, placeholder, maximumWords = 15, counter = false, type = 'text' }, ref) => {
    const [value, setValue] = useState('')

    const handleOnchange = (event: ChangeEvent<HTMLInputElement>) => {
      const currentValue = (event.target as HTMLInputElement).value
      let trimValue: string = currentValue
      if (counter && currentValue.length >= maximumWords) trimValue = currentValue.slice(0, 15)
      setValue(trimValue)
    }

    return (
      <InputContainer>
        <InputTitle>{title}</InputTitle>
        <InputFieldContainer>
          <InputField
            id='input'
            value={value}
            type={type}
            onChange={handleOnchange}
            ref={ref}
            placeholder={placeholder}
          />
          {counter ? (
            <WordCounterContainer>
              <Counter>
                <span>{value.length}</span>/<span>{maximumWords}</span>
              </Counter>
            </WordCounterContainer>
          ) : (
            <></>
          )}
        </InputFieldContainer>
      </InputContainer>
    )
  },
)

export default ClashInput
