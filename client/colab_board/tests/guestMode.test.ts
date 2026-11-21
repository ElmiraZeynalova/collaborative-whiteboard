import { test, expect } from '@playwright/test';

//user creates guest board, reload page, deletes board
test('successfull guest board lifecycle', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Collaborative Whiteboard')).toBeVisible()

    await page.getByPlaceholder('Board name...').fill('guest-board')
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL(/\/boards\/guest\//)
    await expect(page.getByText('Type in your username to enter the room')).toBeVisible()

    await page.getByPlaceholder('Username...').fill('Jack')
    await page.getByRole('button', { name: 'Enter' }).click()

    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Share link' })).toBeVisible()

    const boards = await page.evaluate(() => localStorage.getItem('boards'))
    const parsedBoards = JSON.parse(boards ?? '[]')

    expect(parsedBoards).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: 'guest-board' })
        ])
    )

    await page.reload()

    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Share link' })).toBeVisible()

    await page.getByRole('button', { name: 'Dashboard' }).click()
    await expect(page.getByText('guest-board')).toBeVisible()
    const deleteButton = page.getByRole('button', {
        name: 'Delete board guest-board'
    })
    await page.getByRole('button', { name: 'guest-board' }).hover()

    await expect(deleteButton).toBeVisible()
    await deleteButton.click()

    await expect(page.getByText('Delete board ?')).toBeVisible()
    await page.getByRole('button', { name: 'Delete board', exact: true }).click()

    await expect(page.getByText('guest-board')).not.toBeVisible()

    const boardsAfterDelete = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('boards') ?? '[]')
    )

    expect(boardsAfterDelete).not.toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: 'guest-board' })
        ])
    )
})

//jack creates guest board, alice joins board,
//jack sees her name in members menu
//jack creates rect, alice changes its color, jack sees change
//jack deletes board, alice can't access board anymore
test("guest collaboration full lifecycle", async ({ browser }) => {
    const jackContext = await browser.newContext()
    const aliceContext = await browser.newContext()

    try {
        const jackPage = await jackContext.newPage()
        const alicePage = await aliceContext.newPage()

        await jackPage.goto('/')
        await jackPage.getByPlaceholder('Board name...').fill('jack-board')
        await jackPage.getByRole('button', { name: 'Create' }).click()
        await jackPage.getByPlaceholder('Username...').fill('Jack')
        await jackPage.getByRole('button', { name: 'Enter' }).click()

        const boardLink = jackPage.url()

        await alicePage.goto(boardLink)
        await alicePage.getByPlaceholder('Username...').fill('Alice')
        await alicePage.getByRole('button', { name: 'Enter' }).click()

        await jackPage.getByRole('button', { name: 'members menu' }).click()
        await expect(jackPage.getByText('Me', { exact: true })).toBeVisible()
        await expect(jackPage.getByText('Alice')).toBeVisible()
        await jackPage.getByRole('button', { name: 'leave menu' }).click()

        await jackPage.getByRole('button', { name: 'Rectangle tool' }).click()
        const canvas = jackPage.locator('canvas').first()
        const box = await canvas.boundingBox()
        if (!box) throw new Error('Canvas not found')
        await jackPage.mouse.move(box.x + 150, box.y + 150)
        await jackPage.mouse.down()
        await jackPage.mouse.move(box.x + 300, box.y + 250, { steps: 10 })
        await jackPage.mouse.up()

        await alicePage.getByRole('button', { name: 'Selection tool' }).click()
        const aliceCanvas = alicePage.locator('canvas').first()
        const aliceBox = await aliceCanvas.boundingBox()
        if (!aliceBox) throw new Error('Alice canvas not found')
        await alicePage.mouse.click(
            aliceBox.x + 225,
            aliceBox.y + 200
        )
        const fillColor = alicePage.getByLabel('Fill color')
        await expect(fillColor).toBeVisible()
        await fillColor.fill('#ff0000')
        await expect(fillColor).toHaveValue('#ff0000')

        await jackPage.getByRole('button', { name: 'Selection tool' }).click()
        const jackCanvas = jackPage.locator('canvas').first()
        const jackBox = await jackCanvas.boundingBox()
        if (!jackBox) throw new Error('Alice canvas not found')
        await jackPage.mouse.click(
            jackBox.x + 225,
            jackBox.y + 200
        )
        await expect(jackPage.getByLabel('Fill color')).toHaveValue('#ff0000')

        await jackPage.getByRole('button', { name: 'Dashboard' }).click()
        const deleteButton = jackPage.getByRole('button', {
            name: 'Delete board jack-board'
        })
        await jackPage.getByRole('button', { name: 'jack-board' }).hover()
        await expect(deleteButton).toBeVisible()
        await deleteButton.click()
        await jackPage.getByRole('button', { name: 'Delete board', exact: true }).click()
        await expect(jackPage.getByText('jack-board')).not.toBeVisible()
        const jackBoardsAfterDelete = await jackPage.evaluate(() =>
            JSON.parse(localStorage.getItem('boards') ?? '[]')
        )
        expect(jackBoardsAfterDelete).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'jack-board' })
            ])
        )

        await expect(alicePage.getByText('This board was deleted')).toBeVisible()
        await alicePage.getByRole('button', { name: "Back to dashboard" }).click()
        await expect(alicePage.getByText('Collaborative Whiteboard')).toBeVisible()
        await expect(alicePage.getByText('jack-board')).not.toBeVisible()

        const aliceBoardsAfterDelete = await alicePage.evaluate(() =>
            JSON.parse(localStorage.getItem('boards') ?? '[]')
        )
        expect(aliceBoardsAfterDelete).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'jack-board' })
            ])
        )
    } finally {
        await jackContext.close()
        await aliceContext.close()
    }
})