"use client"
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LogoutButton from '../component/LogoutButton';
export default function Sidebar({ folderId, pageName }) {
    const { data: session } = useSession();
    let recent = '';
    if (pageName == 'recents') {
        recent = true
    } else {
        recent = false
    }
    let folder_id = folderId == 0 ? "" : folderId;
    const [username, setUsername] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [useremail, setEmail] = useState('')
    const [firstchat, setFirstChar] = useState('')
    const router = usePathname();
    const navigate = useRouter();
    const [activeItem, setActiveItem] = useState('folder/0');
    const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        search(value);
    };

    const search = async (term) => {
        try {
            const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/get_data/?offset=0&page_size=1000000`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.token}`,
                },
                body: JSON.stringify({
                    folder_id: folder_id,
                    search_text: term,
                    recent: recent
                }),
            });

            const result = await response.json();
            if (result && result.results && result.results.data && result.results.data) {
                const filteredResults = result.results.data;
                setResults(filteredResults);

            } else {
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {

        }


    };
    useEffect(() => {
        if (router === '/') {
            navigate.push('/folder/0');
        } else {
            setActiveItem(router);
        }
        if (session && session.user) {
            setUsername(session.user.name || '');
            setEmail(session.user.email || '');
            setFirstChar(session.user.name.charAt(0));
        }
    }, [router, session]);

    const handleItemClick = (path) => {
        setActiveItem(path);
    };
    return (
        <div>
            <div className="iq-sidebar sidebar-default d-flex flex-column ">
                <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
                    <Link href="/folder/0" className="header-logo iq-navbar-logo">
                        <img src="/logo2.png" className="img-fluid rounded-normal light-logo" alt="logo" />
                    </Link>

                    <div className="iq-menu-bt-sidebar">
                        <i className="las la-bars wrapper-menu"></i>
                    </div>
                </div>
                <div className="data-scrollbar" data-scroll="1">
                    {/* <div className="new-create select-dropdown input-prepend input-append">
                <div className="btn-group">
                <div className="search-query selet-caption"><a href="#"><i className="lar la-file-alt iq-arrow-left  pr-2"></i>All Files</a></div><span className="search-replace"></span>
                <span className="caret"></span>
                </div>
            </div> */}
                    <nav className="iq-sidebar-menu">
                        <ul id="iq-sidebar-toggle" className="iq-menu">
                            <li className={activeItem === '/folder/0' ? 'selet-caption' : ''}>
                                <Link href="/folder/0" onClick={() => handleItemClick('/folder/0')}>
                                    <i className="lar la-file-alt iq-arrow-left pr-2"></i>All Files
                                </Link>
                                <ul id="page-folders" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                                </ul>
                            </li>
                            <li className={activeItem === '/recents' ? 'selet-caption' : ''}>
                                <Link href="/recents/0" onClick={() => handleItemClick('/recents')}>
                                    <i className="las la-stopwatch iq-arrow-left"></i><span>Recent</span>
                                </Link>
                                <ul id="page-folders" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                                </ul>
                            </li>

                            <li className=" ">
                            <Link  href="/#" className="">
                                    <i className="las la-signature"></i><span>Sign</span>
                            </Link >
                                <ul id="page-fevourite" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                                </ul>
                            </li>
                            <li className=" ">
                                <a href="../backend/page-favourite.html" className="">
                                    <i className="las la-th"></i><span>App</span>
                                </a>
                                <ul id="page-fevourite" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                                </ul>
                            </li>
                            <li className=" ">
                            <Link href="/trash" className="">
                                    <i className="las la-trash-alt iq-arrow-left"></i><span>Trash</span>
                                </Link>
                                <ul id="page-delete" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                                </ul>
                            </li>
                            <li className=" ">
                                <a href="#otherpage" className="collapsed" data-toggle="collapse" aria-expanded="false">
                                    <i className="lab la-wpforms iq-arrow-left"></i><span>My Collection</span>
                                    <i className="las la-angle-right iq-arrow-right arrow-active"></i>
                                    <i className="las la-angle-down iq-arrow-right arrow-hover"></i>
                                </a>
                                <ul id="otherpage" className="iq-submenu collapse" data-parent="#iq-sidebar-toggle">
                                    <li className=" ">
                                        <a href="#user" className="collapsed" data-toggle="collapse" aria-expanded="false">
                                            <i className="las la-user-cog"></i><span>Favourites</span>
                                            <i className="las la-angle-right iq-arrow-right arrow-active"></i>
                                            <i className="las la-angle-down iq-arrow-right arrow-hover"></i>
                                        </a>
                                        <ul id="user" className="iq-submenu collapse" data-parent="#otherpage">
                                            <li className=" ">
                                                <a href="../app/user-profile.html">
                                                    <i className="las la-id-card"></i><span>favourite 1</span>
                                                </a>
                                            </li>
                                            <li className=" ">
                                                <a href="../app/user-add.html">
                                                    <i className="las la-user-plus"></i><span>favourite 2</span>
                                                </a>
                                            </li>
                                            <li className=" ">
                                                <a href="../app/user-list.html">
                                                    <i className="las la-list-alt"></i><span>favourite 3</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>


                                </ul>
                            </li>

                        </ul>
                    </nav>

                    <div className="p-3"></div>
                </div>
                <div className="sidebar-bottom mt-auto">
                    <h4 className="mb-3"><i className="las la-cloud mr-2"></i>Storage</h4>
                    <p>37.4 MB of 10.0 GB used</p>
                    <div className="iq-progress-bar mb-3">
                        <span className="bg-primary iq-progress progress-1" data-percent="67">
                        </span>
                    </div>
                </div>
            </div>
            <div className="iq-top-navbar">
                <div className="iq-navbar-custom">
                    <nav className="navbar navbar-expand-lg navbar-light p-0">
                        <div className="iq-navbar-logo d-flex align-items-center">
                            <i className="ri-menu-line wrapper-menu"></i>
                            <a href="/folder/0" className="header-logo">
                                <img src="/logo2.png" className="img-fluid rounded-normal light-logo" alt="logo" />
                                {/* <img src="/logo-white.png" className="img-fluid rounded-normal darkmode-logo" alt="logo"/> */}
                            </a>
                        </div>
                        <div className="iq-search-bar device-search position-absolute">
                            <form>
                                <div className="input-prepend input-append">
                                    <div className="btn-group">
                                        <label className="dropdown-toggle searchbox" data-toggle="dropdown">
                                            <input className=" text search-input" type="text" placeholder="Type here to search..." value={searchTerm} onChange={handleInputChange} />
                                            <a className="search-link" href="#"><i className="ri-search-line"></i></a>
                                        </label>
                                        <ul className="resultdropdown dropdown-menu">
                                            {
                                                results.map((item, index) => (
                                                    <li key={index}><div className='item'>
                                                        <img width={20} className='post-load-thumbnail mr-2' src={item.type === 'folder' ? '/folder.png' : item.metadata.file_url} />
                                                        <span>
                                                            <Link href={item.type === 'folder'
                                                                ? `/folder/${item.id}`
                                                                : `/${item.type}/${item.id}/${item.metadata.parent_folder_id}`}>
                                                                {item.name}
                                                            </Link>
                                                        </span>
                                                    </div>
                                                    </li>
                                                ))


                                            }
                                        </ul>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="d-flex align-items-center">

                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
                                <i className="ri-menu-3-line"></i>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ml-auto navbar-list align-items-center">
                                   
                                    <li className="nav-item nav-icon dropdown">
                                        <a href="#" className="search-toggle dropdown-toggle" id="dropdownMenuButton01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="ri-question-line"></i>
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton01">
                                            <div className="card shadow-none m-0">
                                                <div className="card-body p-0 ">
                                                    <div className="p-3">
                                                        <a href="#" className="iq-sub-card pt-0"><i className="ri-questionnaire-line"></i>Get Help</a>
                                                        <a href="#" className="iq-sub-card"><i className="ri-refresh-line"></i>Support</a>
                                                        <a href="#" className="iq-sub-card"><i className="ri-refresh-line"></i>Help center</a>
                                                        <a href="#" className="iq-sub-card"><i className="ri-recycle-line"></i>Get Training</a>

                                                        <a href="#" className="iq-sub-card"><i className="ri-feedback-line"></i>Send Feedback</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item nav-icon dropdown">
                                        <a href="#" className="search-toggle dropdown-toggle" id="dropdownMenuButton01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="las la-clipboard-check"></i>
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton01">
                                            <div className="card shadow-none m-0">
                                                <div className="card-body p-0 ">
                                                    <div className="p-3 navbaraction">
                                                        <strong className='text-left'>Tasks</strong>
                                                        <br />
                                                        <img src='/task.png' />
                                                        <div>
                                                            <strong>You're all caught up
                                                            </strong>
                                                            <p>Tasks assigned to you will appear here. Check back later for work coming your way.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item nav-icon dropdown">
                                        <a href="#" className="search-toggle dropdown-toggle" id="dropdownMenuButton01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="las la-bell"></i>
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton01">
                                            <div className="card shadow-none m-0">
                                                <div className="card-body p-0 ">
                                                    <div className="p-3 navbaraction">
                                                        <strong className='text-left'>Notifications</strong>
                                                        <br />
                                                        <img src='/noti.png' />
                                                        <div>
                                                            <strong>No Notifications
                                                            </strong>
                                                            <p>You don't have any notifications at the moment
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="nav-item nav-icon dropdown caption-content">
                                        <a href="#" className="search-toggle dropdown-toggle" id="dropdownMenuButton03" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                            <div className="caption bg-primary line-height text-capitalize">{firstchat}</div>
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton03">
                                            <div className="card mb-0">

                                                <div className="card-body">
                                                    <div className="profile-header">
                                                        <div className="cover-container text-center">
                                                            <div className="rounded-circle profile-icon text-capitalize bg-primary mx-auto d-block">
                                                                {firstchat}
                                                                <a href="">

                                                                </a>
                                                            </div>
                                                            <div className="profile-detail mt-3">
                                                                <h5><Link
                                                                    href="/profile">{username}</Link></h5>
                                                                <p>{useremail}</p>
                                                            </div>
                                                            <LogoutButton />
                                                        </div>
                                                        <div className="profile-details mt-4 pt-3 border-top">
                                                            <ul>
                                                                <li>
                                                                    <Link href="/profile">View Profile</Link>

                                                                </li>
                                                            </ul>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

