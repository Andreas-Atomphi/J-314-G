/** @type {HTMLUListElement} */
const sortableList = document.querySelector(".sortable-list");

/** @type {NodeListOf<HTMLLIElement>} */
const items = sortableList.querySelectorAll(".sortable-list-item");

/**
 * @function setupAddedNode
 * @param {HTMLLIElement} item
 * @returns {void}
 * */
function setupDraggableItem(item) {
    item.addEventListener("dragstart", () =>
        setTimeout(() => item.classList.add("dragging"), 0),
    );
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
}

items.forEach(setupDraggableItem);

sortableList.addEventListener("dragover", (e) => {
    e.preventDefault();

    /** @type {HTMLLIElement} */
    const draggingItem = document.querySelector(".dragging");
    if (draggingItem == null) return;

    /** @type {HTMLLIElement[]} */
    const siblings = [
        ...sortableList.querySelectorAll(".sortable-list-item:not(.dragging)"),
    ];
    if (siblings.length < 1) return;

    const nextSibling = siblings.find(
        (sibling) => e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2,
    );

    sortableList.insertBefore(draggingItem, nextSibling);
});

sortableList.addEventListener("dragenter", (e) => e.preventDefault());

const sortableListMutationObserver = new MutationObserver(
    (mutationsList, _observer) => {
        const mutation = mutationsList.find(
            (value) => value.type == "childList",
        );
        if (mutation == undefined) return;
        for (const node of mutation.addedNodes) {
            if (node.nodeType == 1) continue;
            setupDraggableItem(node);
        }
    },
);

sortableListMutationObserver.observe(sortableList, {
    childList: true,
    subtree: true,
});
