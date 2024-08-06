﻿import { MaybeRefOrGetter, Ref, onBeforeUnmount, watch, watchEffect } from 'vue'

export type Column = Record<string, unknown> & { field: string, header?: MaybeRefOrGetter<string> }

export const useVirtualization = () => {
  const visibleIndexSet = ref(new Set<number>())
  const isLoaded = ref(false)

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const elem = entry.target as HTMLTableRowElement

      const index = elem.rowIndex - 1

      if (entry.isIntersecting) {
        visibleIndexSet.value.add(index)
      }
      else {
        visibleIndexSet.value.delete(index)
      }
    }

    isLoaded.value = true
  }, { rootMargin: "500px 0px 500px 0px" })

  const observedElements = new WeakSet<HTMLTableRowElement>()

  const observeElement = (element: HTMLTableRowElement) => {
    if (!element) {
      return
    }

    if (observedElements.has(element)) {
      return
    }

    observer.observe(element)
  }

  onBeforeUnmount(() => {
    observer.disconnect()
  })

  return { observeElement, visibleIndexSet, isLoaded }
}

export const useSelection = (items: Ref<unknown[]>, selected: Ref<unknown[]>) => {
  const selectedSet = ref(new Set<unknown>())

  const toggleSelected = (item: unknown, checked: boolean) => {
    if (checked) {
      selectedSet.value.add(item)
    } else {
      selectedSet.value.delete(item)
    }
  }

  const selectAll = (checked: boolean) => {
    if (checked && selectedSet.value.size == 0) {
      for (const item of items.value) {
        selectedSet.value.add(item)
      }
    }
    else {
      selectedSet.value.clear()
    }
  }

  const checkbox = ref<HTMLInputElement>()

  watch(() => [items.value.length, items], () => {
    for (let item of selectedSet.value) {
      if (!items.value.includes(item)) {
        selectedSet.value.delete(item)
      }
    }
  })

  watch(() => [selectedSet.value.size, items.value.length], () => {
    if (!checkbox.value)
      return

    checkbox.value.checked = selectedSet.value.size > 0
    checkbox.value.indeterminate = selectedSet.value.size > 0 && selectedSet.value.size != items.value.length
  })

  watch(() => selectedSet.value.size, () => {
    selected.value = [...selectedSet.value]
  })

  return { selectedSet, toggleSelected, selectAll, checkbox }
}

export const useSorting = (sortField: Ref<string>, sortOrder: Ref<number>, columns: Ref<Column[]>, items: Ref<unknown[]>) => {
  sortField.value ??= columns[0]?.field
  sortOrder.value ??= 1

  const sort = (column: Column) => {
    if (sortField.value == column.field) {
      sortOrder.value = sortOrder.value * -1
    }
    else {
      sortField.value = column.field
      sortOrder.value = 1
    }
  }

  const compareFunction = (field: string, modifier: number) => {
    return (a: unknown, b: unknown) => {
      const field1 = a[field]
      const field2 = b[field]

      if (field1 === field2) {
        return 0
      }

      if (typeof field1 == 'string' || typeof field2 == 'string') {
        if (!field1)
          return -1 * modifier
        if (!field2)
          return 1 * modifier

        return field1.localeCompare(field2) * modifier
      }

      return (Number(field1) - Number(field2)) * modifier
    }
  }

  watchEffect(() => {
    items.value.sort(compareFunction(sortField.value, sortOrder.value))
  })

  return { sort }
}

export const useClick = (selectedSet: Ref<Set<unknown>>, emit) => {
  const onRowClick = (item: any, column: Column, event: MouseEvent) => {
    // if the click was on the selection column, do nothing
    if (hasParentClass(event.target, 'selection-column')) {
      return
    }

    // if the click was on a link, do nothing
    if (event.target != event.currentTarget) {
      return
    }

    // Support ctrl+click to select multiple rows
    if (event.ctrlKey) {
      if (selectedSet.value.has(item))
        selectedSet.value.delete(item)
      else
        selectedSet.value.add(item)

      return
    }

    emit('rowClick', item, column, event)

    function hasParentClass(element, className: string) {
      do {
        if (element.classList && element.classList.contains(className)) {
          return true
        }
        element = element.parentNode
      } while (element)
      return false
    }
  }

  const onHeaderContextMenu = (column: Column, event: MouseEvent) => {
    if (event.ctrlKey) {
      return
    }
    event.preventDefault()
    emit('headerContextMenuClick', column, event)
  }

  const onRowContextMenu = (event, item, index) => {
    if (event.ctrlKey) {
      return
    }
    event.preventDefault()
    emit('rowContextMenuClick', event, item, index)
  }

  return { onRowClick, onHeaderContextMenu, onRowContextMenu }
}

const useDragDrop = (table: HTMLTableElement, visibleColumns: Ref<any[]>) => {
  // Drag and drop columns
  const onDragStart = (event, col) => {
    event.dataTransfer.setData('text', col.field)
  }

  const onDragOver = event => {
    event.preventDefault()

    const isLeft = event.offsetX < event.target.offsetWidth / 2

    if (isLeft) {
      event.currentTarget.classList.remove('drag-over-right')
      event.currentTarget.classList.add('drag-over-left')
    }
    else {
      event.currentTarget.classList.remove('drag-over-left')
      event.currentTarget.classList.add('drag-over-right')
    }
  }

  const onDragLeave = event => {
    event.currentTarget.classList.remove('drag-over-left')
    event.currentTarget.classList.remove('drag-over-right')
  }

  const onDrop = (event, col) => {
    let field = event.dataTransfer.getData('text')

    event.currentTarget.classList.remove('drag-over-left')
    event.currentTarget.classList.remove('drag-over-right')

    if (field == col.field)
      return

    const isLeft = event.offsetX < event.target.offsetWidth / 2

    const columns = [...visibleColumns.value]

    columns.splice(columns.indexOf(field), 1)

    const index = columns.indexOf(col.field)

    if (isLeft) {
      columns.splice(index, 0, field)
    }
    else {
      columns.splice(index + 1, 0, field)
    }

    visibleColumns.value = columns
  }

  //draggable @dragstart="onDragStart($event, col)" @dragenter.prevent @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop($event, col)"
}