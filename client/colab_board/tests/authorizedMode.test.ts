import { test, expect } from '@playwright/test'

test('user can register, logout and login again', async ({ page }) => {
    const email = `test-${crypto.randomUUID()}@example.com`
    const password = 'TestPassword123!'

    await page.goto('/login')

    await page.getByPlaceholder('example@gmail.com').fill(email)
    await page.getByPlaceholder('password').fill(password)
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText("You're logged in")).toBeVisible()

    await page.getByRole('button', { name: 'Log out' }).click()
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page).toHaveURL('/login')

    await page.getByPlaceholder('example@gmail.com').fill(email)
    await page.getByPlaceholder('password').fill(password)
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText("You're logged in")).toBeVisible()
})


//jack registers, creates board, shares link with alice
//alice registers, enters room, writes text, jack sees text
//alice modifies text, jack sees change, alice deletes board
//jack still able to access board bc he's the owner and still sees text
test('account board lifecycle between two authenticated users', async ({ browser }) => {
    const jackContext = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'],
    })
    const aliceContext = await browser.newContext()

    const jackPage = await jackContext.newPage()
    const alicePage = await aliceContext.newPage()

    const jackEmail = `jack-${crypto.randomUUID()}@example.com`
    const aliceEmail = `alice-${crypto.randomUUID()}@example.com`
    const password = 'TestPassword123!'

    try {
        await jackPage.goto('/login')
        await jackPage.getByPlaceholder('example@gmail.com').fill(jackEmail)
        await jackPage.getByPlaceholder('password').fill(password)
        await jackPage.getByRole('button', { name: 'Log in' }).click()

        await expect(jackPage).toHaveURL('/')

        await jackPage.getByPlaceholder('Board name...').fill('jack-board')
        await jackPage.getByRole('button', { name: 'Create' }).click()
        await expect(jackPage).toHaveURL(/\/boards\/[^/]+/)
        const boardUrl = jackPage.url()

        await expect(jackPage.getByText('Type in your username to enter the room')).toBeVisible()
        await jackPage.getByPlaceholder('Username...').fill('Jack')
        await jackPage.getByRole('button', { name: 'Enter' }).click()

        await expect(jackPage.getByRole('button', { name: 'Dashboard' })).toBeVisible()
        await expect(jackPage.getByRole('button', { name: 'Share link' })).toBeVisible()

        await jackPage.getByRole('button', { name: "Share link" }).click()
        await jackPage.getByRole('button', { name: "copy link button" }).click()
        await jackPage.getByRole('button', { name: "cross button" }).click()

        const shareLink = await jackPage.evaluate(() => navigator.clipboard.readText())
        expect(shareLink).toContain('share=')

        await alicePage.goto('/login')
        await alicePage.getByPlaceholder('example@gmail.com').fill(aliceEmail)
        await alicePage.getByPlaceholder('password').fill(password)
        await alicePage.getByRole('button', { name: 'Log in' }).click()

        await expect(alicePage).toHaveURL('/')

        await alicePage.goto(shareLink)
        await expect(alicePage).toHaveURL(/\/boards\/[^/]+/)
        await alicePage.getByPlaceholder('Username...').fill('Alice')
        await alicePage.getByRole('button', { name: 'Enter' }).click()

        await alicePage.getByRole('button', { name: 'Text tool' }).click()
        const aliceCanvas = alicePage.locator('canvas').first()
        const aliceBox = await aliceCanvas.boundingBox()
        if (!aliceBox) throw new Error('Alice canvas not found')

        await alicePage.mouse.click(aliceBox.x + 200, aliceBox.y + 150)
        const textEditor = alicePage.getByLabel('textarea')
        await expect(textEditor).toBeVisible()
        await textEditor.fill('Hello from Alice')
        await textEditor.press('Enter')

        await jackPage.getByRole('button', { name: 'Selection tool' }).click()

        const jackCanvas = jackPage.locator('canvas').first()
        const jackBox = await jackCanvas.boundingBox()
        if (!jackBox) throw new Error('Jack canvas not found')

        await jackPage.mouse.dblclick(
            jackBox.x + 200,
            jackBox.y + 150
        )

        const jackEditor = jackPage.getByLabel('textarea')
        await expect(jackEditor).toHaveValue('Hello from Alice')
        await jackEditor.press('Enter')

        await alicePage.getByRole('button', { name: 'Selection tool' }).click()
        await alicePage.mouse.dblclick(
            aliceBox.x + 200,
            aliceBox.y + 150
        )

        const aliceEditor = alicePage.getByLabel('textarea')
        await expect(aliceEditor).toHaveValue('Hello from Alice')

        await aliceEditor.fill('Updated by Alice')
        await aliceEditor.press('Enter')

        await jackPage.mouse.dblclick(
            jackBox.x + 200,
            jackBox.y + 150
        )
        await expect(jackEditor).toHaveValue('Updated by Alice')
        await jackEditor.press('Enter')

        await alicePage.goto('/')
        await expect(alicePage.getByText("jack-board")).toBeVisible()

        const deleteButton = alicePage.getByRole('button', {
            name: 'Delete board jack-board'
        })
        await alicePage.getByRole('button', { name: 'jack-board' }).hover()
        await expect(deleteButton).toBeVisible()
        await deleteButton.click()
        await expect(alicePage.getByText('jack-board')).not.toBeVisible()

        await jackPage.goto('/')
        await expect(jackPage).toHaveURL('/')
        await expect(jackPage.getByText('jack-board')).toBeVisible()

        await jackPage.goto(boardUrl)
        await expect(jackPage).toHaveURL(/\/boards\/[^/]+/)
        await jackPage.mouse.dblclick(
            jackBox.x + 200,
            jackBox.y + 150
        )
        await expect(jackEditor).toHaveValue('Updated by Alice')
        await jackEditor.press('Enter')
    } finally {
        await Promise.allSettled([
            jackContext.close(),
            aliceContext.close(),
        ])
    }
})

//jack registers, creates board, shares link with registered alice
//jack bans alice, alice can't access board, jack unbans alice and makes her admin
//alice now is able to chnage board name, she changes it, jack sees change,
//jack deletes board permanently as an owner
//alice can't access board anymore
test('account board permissions lifecycle between owner and member', async ({ browser }) => {
    const jackContext = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'],
    })
    const aliceContext = await browser.newContext()

    const jackPage = await jackContext.newPage()
    const alicePage = await aliceContext.newPage()

    const jackEmail = `jack-${crypto.randomUUID()}@example.com`
    const aliceEmail = `alice-${crypto.randomUUID()}@example.com`
    const password = 'TestPassword123!'

    try {
        await jackPage.goto('/login')
        await jackPage.getByPlaceholder('example@gmail.com').fill(jackEmail)
        await jackPage.getByPlaceholder('password').fill(password)
        await jackPage.getByRole('button', { name: 'Log in' }).click()

        await expect(jackPage).toHaveURL('/')

        await jackPage.getByPlaceholder('Board name...').fill('jack-board')
        await jackPage.getByRole('button', { name: 'Create' }).click()

        await expect(jackPage).toHaveURL(/\/boards\/[^/]+/)
        const boardUrl = jackPage.url()

        await jackPage.getByPlaceholder('Username...').fill('Jack')
        await jackPage.getByRole('button', { name: 'Enter' }).click()

        await jackPage.getByRole('button', { name: 'Share link' }).click()
        await jackPage.getByRole('button', { name: 'copy link button' }).click()
        const shareLink = await jackPage.evaluate(() => navigator.clipboard.readText())
        await jackPage.getByRole('button', { name: 'cross button' }).click()

        expect(shareLink).toContain('share=')

        await alicePage.goto('/login')
        await alicePage.getByPlaceholder('example@gmail.com').fill(aliceEmail)
        await alicePage.getByPlaceholder('password').fill(password)
        await alicePage.getByRole('button', { name: 'Log in' }).click()

        await expect(alicePage).toHaveURL('/')

        await alicePage.goto(shareLink)
        await expect(alicePage).toHaveURL(/\/boards\/[^/]+/)

        await alicePage.getByPlaceholder('Username...').fill('Alice')
        await alicePage.getByRole('button', { name: 'Enter' }).click()

        await jackPage.getByRole('button', { name: "members menu" }).click()

        const banButton = jackPage.getByRole('button', { name: 'ban member' })
        await jackPage.getByText('Alice').hover()
        await expect(banButton).toBeVisible()
        await banButton.click()

        await expect(alicePage.getByText("access denied")).toBeVisible()

        await jackPage.getByText('Alice').hover()
        await expect(banButton).toBeVisible()
        await banButton.click()

        await alicePage.getByRole('button', { name: 'Recheck access' }).click()
        await expect(alicePage.getByText("access denied")).not.toBeVisible()
        await expect(alicePage.getByText("Dashboard")).toBeVisible()
        await expect(alicePage.getByText("jack-board")).toBeVisible()
        await expect(alicePage.getByText("Collaborative Whiteboard")).not.toBeVisible()
        const aliceBadge = jackPage
            .locator('[aria-label="user badge"]')
            .filter({ hasText: 'Alice' })

        await aliceBadge.hover()

        const makeAdminButton = aliceBadge.getByRole('button', {
            name: 'make admin'
        })

        await expect(makeAdminButton).toBeVisible()
        await makeAdminButton.evaluate((button: HTMLButtonElement) => {
            button.click()
        })
        await expect(jackPage.getByText('admin')).toBeVisible()

        await jackPage.getByRole('button', { name: 'leave menu' }).click()
        await alicePage.reload()

        const boardNameInput = alicePage.getByLabel('board name')

        await expect(boardNameInput).toBeVisible()
        await boardNameInput.fill('jack-board22')


        await expect(boardNameInput).toHaveValue('jack-board22')
        await jackPage.reload()
        await expect(jackPage.getByLabel('board name')).toHaveValue('jack-board22')
        await jackPage.getByRole('button', { name: "Dashboard" }).click()
        const deleteButton = jackPage.getByRole('button', {
            name: 'Delete board jack-board22'
        })
        await jackPage.getByRole('button', { name: 'jack-board22' }).hover()
        await expect(deleteButton).toBeVisible()
        await deleteButton.click()
        await jackPage.getByRole('button', { name: 'Delete board' }).click()
        await expect(jackPage.getByText('jack-board')).not.toBeVisible()

        await expect(alicePage.getByText('This board was deleted')).toBeVisible()
        await alicePage.getByRole('button', { name: "Back to dashboard" }).click()
        await expect(alicePage.getByText('Collaborative Whiteboard')).toBeVisible()
        await expect(alicePage.getByText('jack-board22')).not.toBeVisible()
    } finally {
        await Promise.allSettled([
            jackContext.close(),
            aliceContext.close(),
        ])
    }
})
