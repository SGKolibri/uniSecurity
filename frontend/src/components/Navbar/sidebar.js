
export default function Sidebar({ children }) {

    return (
        <>
            {/* Animated Sidebar */}
            <div className="sidebar"
                style={{
                    animation: 'slideIn 0.5s ease-in-out',
                    transition: 'all 0.5s ease-in-out',
                    

                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100vh',
                    width: '75vw',
                    backgroundColor: '#0850BC',
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    overflowX: 'hidden',
                    paddingTop: '20px',
                    boxShadow: '0px 0px 100px 0px rgba(0,0,0,1)'
                }}
            >
                <ul className="sidebarList">
                    {children}
                </ul>
            </div>
        </>
    )
}