import { getTagItems } from "tags"
import { Tag } from "types"

export const parseTags = (tagNames: string): Tag => {
  const parsedTags: Map<string, string> = new Map()
  tagNames.split(",").forEach((tagName) => {
    const intersectingTags = getIntersectionTags(tagName)

    if (!intersectingTags.length) {
      return
    }

    intersectingTags.forEach((tag) => {
      parsedTags.set(tag.path, tag.title)
    })
  })

  return Array.from(parsedTags).map(([path, title]) => ({
    title,
    path,
  }))
}

const getIntersectionTags = (tags: string): Tag => {
  const tagsToIntersect: Tag[] = tags
    .split("+")
    .map((tagName) => getTagItems(tagName))
    .filter((tag) => tag !== undefined) as Tag[]

  if (tagsToIntersect.length < 2) {
    // if there are less than 2 tags to intersect, return an empty array
    return []
  }

  return tagsToIntersect[0].filter((tagItem) => {
    return tagsToIntersect
      .slice(1)
      .every((otherTag) =>
        otherTag.some(
          (otherTagItem) =>
            otherTagItem.title === tagItem.title &&
            otherTagItem.path === tagItem.path
        )
      )
  })
}
