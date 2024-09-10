"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from "../../component/sidebar";
import Footer from "../../component/footer";
import Upload from "../../component/Upload";
import Filedrop from "../../component/Filedrop";
import { useSession } from "next-auth/react";
import ActionBtn from "../../component/ActionBtn";
import { convertSize } from '/utils/common';
import Link from 'next/link';
const Recents = ({ params: { slug } }) => {
  const [firstParam, secondParam] = slug;
  const { data: session } = useSession();
  const [tabledata, setTableData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [folderName, setFolderName] = useState('');
  const page_size = 10;
  const initialFetch = useRef(false);  // Track if the initial fetch has occurred

  useEffect(() => {
    setTableData([]);
    setIsFirstLoad(true); // Reset to true when slug changes
    setOffset(0);
    setHasMore(true);
  }, [slug]);

  useEffect(() => {
    if (session && session.user && !initialFetch.current) {
      initialFetch.current = true;  // Set to true to prevent subsequent calls

      fetchData();
    }
  }, [session]);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      let folder_id = firstParam == 0 ? "" : firstParam;
      const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/get_data/?offset=${offset}&page_size=${page_size}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          folder_id: folder_id,
          search_text: "",
          recent: true,
        }),
      });

      const result = await response.json();
      if (result && result.results && result.results.data && result.results.data) {
        const newData = result.results.data;
        if (result.results.is_root != true) {
          setFolderName(result.results.parent_folder_name)
        }
        setTableData(prevData => [...prevData, ...newData]);
        setOffset(prevOffset => prevOffset + page_size);
        setHasMore(!!result.next);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [offset, loading, hasMore, session?.token]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore && !loading) {
      fetchData();
    }
  }, [fetchData, hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <Sidebar folderId={firstParam} pageName="recents" />
      <div className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 col-lg-12 col-md-12 col-xl-12">
              <div className="d-flex justify-content-between mb-2">
                <div className="header-title">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className={`breadcrumb-item ${!folderName ? "active" : "inactive"}`}>
                        <a href="/folder/0">
                          <h6>All Recents</h6>
                        </a>
                      </li>
                      {folderName && (
                        <li className={`breadcrumb-item ${folderName ? "active" : "inactive"}`}>
                          <h6>{folderName}</h6>
                        </li>
                      )}
                    </ol>
                  </nav>

                </div>
                <div className="header-title">
                  <Upload urldata={slug} />
                </div>
              </div>
              {isFirstLoad ? (
                <div></div>
              ) : tabledata.length > 0 ? (
                <table className="table filelist">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabledata.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td>
                          <img className='post-load-thumbnail' src={item.type === 'folder' ? '/folder.png' : item.metadata.file_url} />
                          <span>
                            <Link href={item.type === 'folder'
                              ? `/folder/${item.id}`
                              : `/${item.type}/${item.id}/${item.metadata.parent_folder_id}`}>
                              {item.name}
                            </Link>
                          </span>
                        </td>
                        <td className='sizefile'>{item.type === 'folder' ? item.metadata.filecount : convertSize(item.metadata.file_size)}</td>
                        <div className="action-icon">
                        <ActionBtn itemid={item.id} itemType={item.type} />
                      </div>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                !loading &&
                <Filedrop urldata={slug} />
              )}

              {loading && <div>Loading  files...</div>}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default Recents;
