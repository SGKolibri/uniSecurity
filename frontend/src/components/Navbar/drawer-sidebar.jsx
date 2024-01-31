import React from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

export default function DrawerSidebar({ children, isOpen, onClose, btnRef }) {

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent
                    style={{
                        backgroundColor: '#0850BC',
                        color: '#fff',
                    }}
                >
                    <DrawerCloseButton />
                    <DrawerBody>
                        {children}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}