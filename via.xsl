<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:viarecord="http://via.lib.harvard.edu" xmlns:xlink="http://www.w3.org/TR/xlink">
	<xsl:template match="/surrogate">
		<html>
			<body>
				<div class="VRAThumbnail">
					<table>
						<tr>
							<td>
								<a class="fancybox fancybox.iframe">
									<xsl:attribute name="href">
										<xsl:value-of select="image/@xlink:href" />
									</xsl:attribute>
									<xsl:attribute name="title">
										<xsl:value-of select="title/textElement"/>
									</xsl:attribute>
									<xsl:attribute name="data-fancybox-group">
                                                                                <xsl:value-of select="repository/number"/>
                                                                        </xsl:attribute>
									<img>
										<xsl:attribute name="src">
        	                                                                        <xsl:value-of select="concat(image/@xlink:href, '?height=150&amp;width=150')" />
	                                                                        </xsl:attribute>
									</img>
								</a>
							</td>
						</tr>
					</table>
				</div>



			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>


