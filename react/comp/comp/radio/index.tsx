import React, { useState } from "react"
import { layout, type LayoutNode } from "./constant"

const Radio = () => {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="flex flex-col">
      {renderItems(layout, selected, setSelected)}
    </div>
  )
}

const getItemId = (parentId: string, key: string) => {
  return parentId ? `${parentId}.${key}` : key
}

const getOptions = (value: string): string[] => {
  const collectOptions = (items: LayoutNode, parentId: string): string[] => {
    return Object.entries(items).flatMap(([key, child]) => {
      const itemId = getItemId(parentId, key)
      return [
        itemId,
        ...(child === null ? [] : collectOptions(child, itemId)),
      ]
    })
  }

  const findOptions = (items: LayoutNode, parentId = ""): string[] | null => {
    for (const [key, child] of Object.entries(items)) {
      const itemId = getItemId(parentId, key)

      if (itemId === value) {
        return [itemId, ...(child === null ? [] : collectOptions(child, itemId))]
      }

      if (child !== null) {
        const options = findOptions(child, itemId)

        if (options !== null) {
          return options
        }
      }
    }

    return null
  }

  return findOptions(layout) ?? []
}

const fillGaps = (selected: string[]): string[] => {
  const selectedSet = new Set(selected)

  const syncParents = (items: LayoutNode, parentId = ""): boolean => {
    let allItemsSelected = true
    for (const [key, child] of Object.entries(items)) {
      const itemId = getItemId(parentId, key)
      const isSelected = child === null ? selectedSet.has(itemId) : syncParents(child, itemId)

      if (isSelected) {
        selectedSet.add(itemId)
      } else {
        selectedSet.delete(itemId)
        allItemsSelected = false
      }
    }

    return allItemsSelected
  }

  syncParents(layout)

  return Array.from(selectedSet)
}

const renderItems = (
  items: LayoutNode,
  selected: string[],
  setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  level = 0,
  parentId = ""
): React.ReactNode => {
  const handleChange = (value: string) => {
    const options = getOptions(value)

    setSelected((curr) => {
      if (curr.includes(value)) {
        return fillGaps(curr.filter((elem) => !options.includes(elem)))
      }

      return fillGaps(Array.from(new Set([...curr, ...options])))
    })
  }

  return Object.entries(items).map(([key, value]) => {
    const itemId = getItemId(parentId, key)
    const hasChildren = value !== null

    return (
      <div key={itemId} className="flex flex-col">
        <label
          className="flex gap-3"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <input
            checked={selected.includes(itemId)}
            type="checkbox"
            value={itemId}
            onChange={() => handleChange(itemId)}
          />
          {key}
        </label>
        {hasChildren && renderItems(value, selected, setSelected, level + 1, itemId)}
      </div>
    )
  })
}

export default Radio
