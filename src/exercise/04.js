// Window large lists with react-virtual
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
// 🐨 import the useVirtual hook from react-virtual
import {useVirtual} from 'react-virtual'
import {useCombobox} from '../use-combobox'
import {getItems} from '../filter-cities'
import {useForceRerender} from '../utils'

// 💰 I made this for you, you'll need it later:
const getVirtualRowStyles = ({size, start}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: size,
  transform: `translateY(${start}px)`,
})

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  listRef,
  virtualRows,
  totalHeight,
}) {
  return (
    // 🐨 pass the listRef to the `getMenuProps` prop getter function below:
    // 💰  getMenuProps({ref: listRef})
    <ul {...getMenuProps({ref: listRef})}>
      <li style={{height: totalHeight}} />
      {/* 🐨 add a li here with an inline style for the height set to the totalHeight */}
      {/*
        🦉 this is to ensure that the scrollable area of the <ul /> is the
        same height it would be if we were actually rendering everything
      */}
      {/* instead of mapping the "items" we're going to map over the virtualRows */}
      {/* 🐨 swap `items` with `virtualRows` */}
      {/*
        💰 a virtual row is an object with the following properties:
        - index: you can use this to get the `item` via `items[index]`
        - size: set the "height" style to this value
        - start: this is how many pixels from the scrollTop this item should be
      */}
      {virtualRows.map((index, size, start) => {
        const item = items[index]
        if (!item) return null
        return (
          <ListItem
            key={item.id}
            getItemProps={getItemProps}
            item={item}
            index={index}
            isSelected={selectedItem?.id === item.id}
            isHighlighted={highlightedIndex === index}
            style={getVirtualRowStyles({size, start})}
          >
            {item.name}
          </ListItem>
        )
      })}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  // 🐨 accept the style prop
  style,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
          fontWeight: isSelected ? 'bold' : 'normal',
          // 🐨 spread the incoming styles onto this inline style object
          ...style,
        },
        ...props,
      })}
    />
  )
}

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const allItems = React.useMemo(() => getItems(inputValue), [inputValue])
  const items = allItems.slice(0, 100)
  const listRef = React.useRef()

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: React.useCallback(() => 20, []),
    overscan: 10,
  })

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
    scrollIntoView: () => {},
    onHighlightedIndexChange: ({highlightedIndex}) =>
      highlightedIndex !== -1 && rowVirtualizer.scrollToIndex(highlightedIndex),
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          listRef={listRef}
          virtualRows={rowVirtualizer.virtualItems}
          totalHeight={rowVirtualizer.totalSize}
        />
      </div>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
